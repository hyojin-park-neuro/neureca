(function () {
  "use strict";

  var REGION_DETAILS = {
    cortex: ["Cerebral cortex", "The folded cortical mantle supporting perception, thought, and communication."],
    prefrontal: ["Prefrontal cortex", "Predictive context and goal-dependent modulation during natural communication."],
    language: ["Inferior frontal gyrus", "Semantic composition, speech production, and multimodal meaning construction."],
    motor: ["Motor cortex", "Speech timing, articulatory prediction, and sensorimotor coupling."],
    somatosensory: ["Somatosensory cortex", "Somatosensory contributions to speech perception and multisensory integration."],
    parietal: ["Parietal association cortex", "Cross-modal attention and audiovisual interaction across naturalistic tasks."],
    angular: ["Angular gyrus", "Conceptual integration across language, vision, and contextual knowledge."],
    auditory: ["Auditory cortex", "Speech-envelope tracking, auditory tagging, and naturalistic comprehension."],
    temporal: ["Temporal cortex", "Distributed semantic representations across spoken and visual communication."],
    visual: ["Visual cortex", "Visual speech, lip-derived temporal information, and visual-frequency tagging."],
    occipital: ["Occipital lobe", "Visual analysis and the cortical representation of dynamic sensory information."],
    cerebellum: ["Cerebellum", "Timing, prediction, and coordinated action across cognitive and sensorimotor systems."],
    brainstem: ["Brainstem", "Ascending sensory pathways and core systems that connect the brain with the body."]
  };

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  ready(function () {
    var root = document.getElementById("neureca-outward-labels-repaired-photos-v26");
    var stage = document.getElementById("v26-stage");
    var canvas = document.getElementById("v26-canvas");
    var detailName = document.getElementById("v26-detail-name");
    var detailText = document.getElementById("v26-detail-text");
    var payload = window.NEURECA_BRAIN_PATHS;
    if (!root || !stage || !canvas || !payload || !payload.paths || !payload.labels || !canvas.getContext) return;

    var context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) return;

    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var state = {
      width: 0,
      height: 0,
      dpr: 1,
      yaw: -0.08,
      pitch: -0.035,
      dragging: false,
      moved: false,
      lastX: 0,
      lastY: 0,
      hover: "",
      pinned: "",
      hitLabels: [],
      lastFrame: 0,
      lastTick: 0,
      dirty: true
    };

    function clamp(value, minimum, maximum) {
      return Math.max(minimum, Math.min(maximum, value));
    }

    function foreground() {
      return getComputedStyle(root).getPropertyValue("--foreground").trim() || "#191b1b";
    }

    function resize() {
      var rectangle = stage.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      var width = Math.max(1, Math.round(rectangle.width));
      var height = Math.max(1, Math.round(rectangle.height));
      if (width === state.width && height === state.height && dpr === state.dpr) return;
      state.width = width;
      state.height = height;
      state.dpr = dpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.dirty = true;
    }

    function depthAt(x, y, region) {
      var dx;
      var dy;
      var radial;
      if (region === "cerebellum") {
        dx = (x - 0.34) / 0.62;
        dy = (y + 0.52) / 0.35;
        radial = Math.max(0, 1 - dx * dx - dy * dy);
        return 0.11 + Math.sqrt(radial) * 0.42;
      }
      if (region === "brainstem") {
        dx = (x - 0.22) / 0.2;
        dy = (y + 0.76) / 0.34;
        radial = Math.max(0, 1 - dx * dx - dy * dy);
        return 0.08 + Math.sqrt(radial) * 0.22;
      }
      dx = (x + 0.01) / 1.08;
      dy = (y - 0.13) / 0.88;
      radial = Math.max(0, 1 - dx * dx - dy * dy);
      return 0.09 + Math.sqrt(radial) * 0.64;
    }

    function project(point, side, region) {
      var x = point[0];
      var y = point[1];
      var z = depthAt(x, y, region) * side;
      var cosYaw = Math.cos(state.yaw);
      var sinYaw = Math.sin(state.yaw);
      var cosPitch = Math.cos(state.pitch);
      var sinPitch = Math.sin(state.pitch);
      var rotatedX = x * cosYaw + z * sinYaw;
      var yawZ = -x * sinYaw + z * cosYaw;
      var rotatedY = y * cosPitch - yawZ * sinPitch;
      var rotatedZ = y * sinPitch + yawZ * cosPitch;
      var perspective = 4.15 / (4.15 - rotatedZ);
      var scale = Math.min(state.width / 2.28, state.height / 2.1);
      var normalX = x * 0.18;
      var normalY = (y - 0.08) * 0.12;
      var normalZ = side;
      var normalYawZ = -normalX * sinYaw + normalZ * cosYaw;
      var facing = normalY * sinPitch + normalYawZ * cosPitch;
      return {
        x: state.width * 0.51 + rotatedX * scale * perspective,
        y: state.height * 0.495 - rotatedY * scale * perspective,
        z: rotatedZ,
        facing: facing,
        perspective: perspective
      };
    }

    function labelItem(label, side) {
      var center = project([label.x, label.y], side, label.region);
      if (center.facing < -0.1) return null;
      var direction = 0.025;
      var tangent = project([
        label.x + Math.cos(label.angle) * direction,
        label.y + Math.sin(label.angle) * direction
      ], side, label.region);
      return {
        type: "label",
        text: label.text,
        region: label.region,
        size: label.size,
        x: center.x,
        y: center.y,
        z: center.z,
        facing: center.facing,
        perspective: center.perspective,
        angle: Math.atan2(tangent.y - center.y, tangent.x - center.x)
      };
    }

    function pathItem(path, side) {
      var points = [];
      var totalDepth = 0;
      var totalFacing = 0;
      for (var index = 0; index < path.points.length; index += 1) {
        var point = project(path.points[index], side, path.region);
        points.push(point);
        totalDepth += point.z;
        totalFacing += point.facing;
      }
      if (points.length < 2 || totalFacing / points.length < -0.12) return null;
      return {
        type: "path",
        region: path.region,
        points: points,
        z: totalDepth / points.length + 0.012,
        facing: totalFacing / points.length
      };
    }

    function drawLabel(item, ink, selected) {
      var isSelected = item.region === selected;
      var face = clamp((item.facing + 0.1) / 1.1, 0, 1);
      var fontSize = clamp(state.width * 0.0091, 5.6, 9.2) * item.size * item.perspective;
      var weight = item.size >= 1.24 ? 600 : (item.size >= 0.9 ? 500 : 400);
      var alpha = clamp(0.25 + face * 0.72, 0.18, 0.96);
      if (selected && !isSelected) alpha *= 0.34;
      if (isSelected) alpha = 1;
      var foreshorten = clamp(0.26 + Math.abs(item.facing) * 0.78, 0.26, 1);

      context.save();
      context.translate(item.x, item.y);
      context.rotate(item.angle);
      context.scale(foreshorten, 1);
      context.font = weight + " " + fontSize + "px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = ink;
      context.globalAlpha = alpha;
      context.fillText(item.text, 0, 0);
      context.restore();
    }

    function drawPath(item, ink, selected) {
      var isSelected = item.region === selected;
      var face = clamp((item.facing + 0.12) / 1.12, 0, 1);
      var alpha = clamp(0.28 + face * 0.68, 0.2, 0.96);
      if (selected && !isSelected) alpha *= 0.4;
      if (isSelected) alpha = 1;
      context.strokeStyle = ink;
      context.globalAlpha = alpha;
      context.lineWidth = (0.7 + face * 1.05) * (isSelected ? 1.2 : 1);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      var drawing = false;
      for (var index = 0; index < item.points.length; index += 1) {
        var point = item.points[index];
        if (point.facing < -0.12) {
          drawing = false;
          continue;
        }
        if (!drawing) {
          context.moveTo(point.x, point.y);
          drawing = true;
        } else {
          context.lineTo(point.x, point.y);
        }
      }
      context.stroke();
      context.globalAlpha = 1;
    }

    function draw() {
      resize();
      context.clearRect(0, 0, state.width, state.height);
      var ink = foreground();
      var selected = state.pinned || state.hover;
      var items = [];
      var hitLabels = [];
      var sideIndex;
      var side;
      var item;

      for (var labelIndex = 0; labelIndex < payload.labels.length; labelIndex += 1) {
        for (sideIndex = 0; sideIndex < 2; sideIndex += 1) {
          side = sideIndex === 0 ? 1 : -1;
          item = labelItem(payload.labels[labelIndex], side);
          if (!item) continue;
          items.push(item);
          if (item.facing > 0.08) hitLabels.push(item);
        }
      }
      for (var pathIndex = 0; pathIndex < payload.paths.length; pathIndex += 1) {
        for (sideIndex = 0; sideIndex < 2; sideIndex += 1) {
          side = sideIndex === 0 ? 1 : -1;
          item = pathItem(payload.paths[pathIndex], side);
          if (item) items.push(item);
        }
      }

      items.sort(function (first, second) { return first.z - second.z; });
      for (var index = 0; index < items.length; index += 1) {
        if (items[index].type === "path") drawPath(items[index], ink, selected);
        else drawLabel(items[index], ink, selected);
      }
      state.hitLabels = hitLabels;
      state.dirty = false;
      root.classList.add("v26-live");
    }

    function nearestRegion(clientX, clientY) {
      var rectangle = canvas.getBoundingClientRect();
      var x = clientX - rectangle.left;
      var y = clientY - rectangle.top;
      var bestDistance = Math.pow(Math.max(19, state.width * 0.026), 2);
      var bestRegion = "";
      for (var index = state.hitLabels.length - 1; index >= 0; index -= 1) {
        var label = state.hitLabels[index];
        var dx = label.x - x;
        var dy = label.y - y;
        var distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestRegion = label.region;
        }
      }
      return bestRegion;
    }

    function updateDetail(region) {
      var detail = REGION_DETAILS[region];
      if (!detail) {
        detailName.textContent = "Explore the brain";
        detailText.textContent = "Drag to rotate; hover or tap a region name to explore the anatomy.";
      } else {
        detailName.textContent = detail[0];
        detailText.textContent = detail[1];
      }
    }

    function setHover(region) {
      if (state.hover === region) return;
      state.hover = region;
      if (!state.pinned) updateDetail(region);
      state.dirty = true;
    }

    stage.addEventListener("pointerdown", function (event) {
      state.dragging = true;
      state.moved = false;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      stage.classList.add("is-dragging");
      stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener("pointermove", function (event) {
      if (state.dragging) {
        var dx = event.clientX - state.lastX;
        var dy = event.clientY - state.lastY;
        if (Math.abs(dx) + Math.abs(dy) > 2) state.moved = true;
        state.yaw += dx * 0.008;
        state.pitch = clamp(state.pitch + dy * 0.0045, -0.38, 0.38);
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        state.dirty = true;
      } else if (!state.pinned) {
        setHover(nearestRegion(event.clientX, event.clientY));
      }
    });

    function endPointer(event) {
      if (!state.dragging) return;
      state.dragging = false;
      stage.classList.remove("is-dragging");
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      if (!state.moved) {
        var region = nearestRegion(event.clientX, event.clientY);
        state.pinned = state.pinned === region ? "" : region;
        updateDetail(state.pinned || region);
        state.dirty = true;
      }
    }

    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);
    stage.addEventListener("pointerleave", function () {
      if (!state.dragging && !state.pinned) setHover("");
    });
    stage.addEventListener("dblclick", function () {
      state.yaw = -0.08;
      state.pitch = -0.035;
      state.pinned = "";
      setHover("");
      updateDetail("");
      state.dirty = true;
    });
    stage.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        state.yaw += event.key === "ArrowLeft" ? -0.14 : 0.14;
        state.dirty = true;
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        state.pitch = clamp(state.pitch + (event.key === "ArrowUp" ? -0.08 : 0.08), -0.38, 0.38);
        state.dirty = true;
      }
      if (event.key === "Escape") {
        state.pinned = "";
        setHover("");
        updateDetail("");
      }
    });

    if (window.ResizeObserver) new ResizeObserver(function () { state.dirty = true; resize(); }).observe(stage);
    else window.addEventListener("resize", function () { state.dirty = true; });

    function animate(time) {
      var elapsed = Math.min(48, time - (state.lastTick || time));
      state.lastTick = time;
      if (!reducedMotion && !state.dragging && !state.pinned && !state.hover) {
        state.yaw += elapsed * 0.00011;
        state.dirty = true;
      }
      if (state.dirty && (state.dragging || time - state.lastFrame > 32)) {
        draw();
        state.lastFrame = time;
      }
      window.requestAnimationFrame(animate);
    }

    resize();
    draw();
    window.requestAnimationFrame(animate);
  });
})();
