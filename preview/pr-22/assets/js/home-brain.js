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
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  ready(function () {
    var root = document.getElementById("neureca-outward-labels-repaired-photos-v26");
    var stage = document.getElementById("v26-stage");
    var canvas = document.getElementById("v26-canvas");
    var detailName = document.getElementById("v26-detail-name");
    var detailText = document.getElementById("v26-detail-text");
    var payload = window.NEURECA_BRAIN_PATHS;

    if (!root || !stage || !canvas || !payload || !payload.paths || !canvas.getContext) return;

    var context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) return;

    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var state = {
      width: 0,
      height: 0,
      dpr: 1,
      yaw: -0.08,
      pitch: -0.045,
      dragging: false,
      moved: false,
      lastX: 0,
      lastY: 0,
      hover: "",
      pinned: "",
      hitPaths: [],
      lastFrame: 0,
      lastTick: 0,
      dirty: true
    };

    function clamp(value, minimum, maximum) {
      return Math.max(minimum, Math.min(maximum, value));
    }

    function cssColor(name, fallback) {
      var value = getComputedStyle(root).getPropertyValue(name).trim();
      return value || fallback;
    }

    function palette() {
      return {
        base: cssColor("--v26-brain-base", "#374a47"),
        quiet: cssColor("--muted-foreground", "#5d6563"),
        accent: cssColor("--v26-brain-hover", "#8e7488")
      };
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
        return 0.12 + Math.sqrt(radial) * 0.38;
      }
      if (region === "brainstem") {
        dx = (x - 0.22) / 0.2;
        dy = (y + 0.76) / 0.34;
        radial = Math.max(0, 1 - dx * dx - dy * dy);
        return 0.09 + Math.sqrt(radial) * 0.2;
      }
      dx = (x + 0.01) / 1.08;
      dy = (y - 0.13) / 0.88;
      radial = Math.max(0, 1 - dx * dx - dy * dy);
      return 0.1 + Math.sqrt(radial) * 0.58;
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
      var perspective = 4.2 / (4.2 - rotatedZ);
      var scale = Math.min(state.width / 2.28, state.height / 2.08);

      var normalX = x * 0.18;
      var normalY = (y - 0.08) * 0.12;
      var normalZ = side;
      var normalYawZ = -normalX * sinYaw + normalZ * cosYaw;
      var facing = normalY * sinPitch + normalYawZ * cosPitch;

      return {
        x: state.width * 0.51 + rotatedX * scale * perspective,
        y: state.height * 0.49 - rotatedY * scale * perspective,
        z: rotatedZ,
        facing: facing
      };
    }

    function visiblePolyline(path, side) {
      var result = [];
      var totalFacing = 0;
      for (var index = 0; index < path.points.length; index += 1) {
        var point = project(path.points[index], side, path.region);
        result.push(point);
        totalFacing += point.facing;
      }
      if (result.length < 2) return null;
      var facing = totalFacing / result.length;
      if (facing < -0.08) return null;
      var first = result[0];
      var last = result[result.length - 1];
      var horizontal = last.x - first.x;
      var vertical = last.y - first.y;
      if (horizontal < -2 || (Math.abs(horizontal) <= 2 && vertical > 0)) result.reverse();
      return { points: result, facing: facing, depth: result.reduce(function (sum, point) { return sum + point.z; }, 0) / result.length };
    }

    function metrics(points) {
      var distances = [0];
      for (var index = 1; index < points.length; index += 1) {
        var dx = points[index].x - points[index - 1].x;
        var dy = points[index].y - points[index - 1].y;
        distances.push(distances[index - 1] + Math.sqrt(dx * dx + dy * dy));
      }
      return { distances: distances, length: distances[distances.length - 1] };
    }

    function pointAt(points, pathMetrics, distance) {
      var distances = pathMetrics.distances;
      var low = 0;
      var high = distances.length - 1;
      while (low < high - 1) {
        var middle = Math.floor((low + high) / 2);
        if (distances[middle] < distance) low = middle;
        else high = middle;
      }
      var first = points[low];
      var second = points[Math.min(low + 1, points.length - 1)];
      var span = distances[Math.min(low + 1, distances.length - 1)] - distances[low];
      var ratio = span ? (distance - distances[low]) / span : 0;
      return {
        x: first.x + (second.x - first.x) * ratio,
        y: first.y + (second.y - first.y) * ratio,
        angle: Math.atan2(second.y - first.y, second.x - first.x)
      };
    }

    function measurePhrase(label, fontSize, spacing) {
      context.font = "500 " + fontSize + "px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      var width = 0;
      for (var index = 0; index < label.length; index += 1) {
        width += context.measureText(label.charAt(index)).width + spacing;
      }
      return width;
    }

    function drawPhrase(label, points, pathMetrics, start, fontSize, spacing, color, alpha, highlighted) {
      var cursor = start;
      context.font = "500 " + fontSize + "px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      context.fillStyle = color;
      context.globalAlpha = alpha;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.shadowColor = highlighted ? color : "transparent";
      context.shadowBlur = highlighted ? 6 : 0;

      for (var index = 0; index < label.length; index += 1) {
        var character = label.charAt(index);
        var advance = context.measureText(character).width + spacing;
        cursor += advance * 0.5;
        if (cursor > pathMetrics.length) break;
        var placement = pointAt(points, pathMetrics, cursor);
        context.save();
        context.translate(placement.x, placement.y);
        context.rotate(placement.angle);
        context.fillText(character, 0, 0);
        context.restore();
        cursor += advance * 0.5;
      }
      context.shadowBlur = 0;
      return cursor;
    }

    function drawTypography(item, colors) {
      var points = item.points;
      var pathMetrics = metrics(points);
      if (pathMetrics.length < 13) return;

      var highlighted = item.region === (state.pinned || state.hover);
      var baseFont = clamp(state.width * 0.0108, 6.1, 10.4);
      var compactLabel = item.label;
      var spacing = clamp(baseFont * 0.12, 0.7, 1.2);
      var phraseWidth = measurePhrase(compactLabel, baseFont, spacing);
      var fontSize = baseFont;

      if (phraseWidth > pathMetrics.length * 0.9) {
        fontSize = baseFont * (pathMetrics.length * 0.9 / phraseWidth);
        fontSize = Math.max(4.7, fontSize);
        spacing = Math.max(0.45, fontSize * 0.11);
        phraseWidth = measurePhrase(compactLabel, fontSize, spacing);
      }
      if (phraseWidth > pathMetrics.length || fontSize < 4.7) return;

      var gap = Math.max(fontSize * 2.2, 12);
      var repeats = Math.max(1, Math.floor((pathMetrics.length + gap) / (phraseWidth + gap)));
      var used = repeats * phraseWidth + (repeats - 1) * gap;
      var cursor = Math.max(0, (pathMetrics.length - used) * 0.5);
      var face = clamp((item.facing + 0.08) / 1.08, 0, 1);
      var depthLight = clamp((item.depth + 0.8) / 1.6, 0.2, 1);
      var alpha = highlighted ? 1 : clamp(0.2 + face * 0.63 + depthLight * 0.12, 0.18, 0.88);
      var color = highlighted ? colors.accent : (face < 0.28 ? colors.quiet : colors.base);

      for (var repeat = 0; repeat < repeats; repeat += 1) {
        cursor = drawPhrase(compactLabel, points, pathMetrics, cursor, fontSize, spacing, color, alpha, highlighted);
        cursor += gap;
      }
      context.globalAlpha = 1;
    }

    function draw() {
      resize();
      context.clearRect(0, 0, state.width, state.height);
      var colors = palette();
      var renderItems = [];
      var hitPaths = [];
      var selected = state.pinned || state.hover;

      for (var pathIndex = 0; pathIndex < payload.paths.length; pathIndex += 1) {
        var path = payload.paths[pathIndex];
        for (var sideIndex = 0; sideIndex < 2; sideIndex += 1) {
          var side = sideIndex === 0 ? 1 : -1;
          var visible = visiblePolyline(path, side);
          if (!visible) continue;
          var item = {
            label: path.label,
            region: path.region,
            points: visible.points,
            facing: visible.facing,
            depth: visible.depth
          };
          if (item.region === selected) item.depth += 4;
          renderItems.push(item);
          if (visible.facing > 0.12) hitPaths.push(item);
        }
      }

      renderItems.sort(function (first, second) { return first.depth - second.depth; });
      for (var index = 0; index < renderItems.length; index += 1) drawTypography(renderItems[index], colors);
      state.hitPaths = hitPaths;
      root.classList.add("v26-live");
    }

    function distanceToSegment(px, py, first, second) {
      var dx = second.x - first.x;
      var dy = second.y - first.y;
      var lengthSquared = dx * dx + dy * dy;
      var amount = lengthSquared ? ((px - first.x) * dx + (py - first.y) * dy) / lengthSquared : 0;
      amount = clamp(amount, 0, 1);
      var x = first.x + amount * dx;
      var y = first.y + amount * dy;
      var offsetX = px - x;
      var offsetY = py - y;
      return offsetX * offsetX + offsetY * offsetY;
    }

    function nearestRegion(clientX, clientY) {
      var rectangle = canvas.getBoundingClientRect();
      var x = clientX - rectangle.left;
      var y = clientY - rectangle.top;
      var bestDistance = Math.pow(Math.max(18, state.width * 0.025), 2);
      var bestRegion = "";
      for (var pathIndex = state.hitPaths.length - 1; pathIndex >= 0; pathIndex -= 1) {
        var path = state.hitPaths[pathIndex];
        for (var pointIndex = 1; pointIndex < path.points.length; pointIndex += 1) {
          var distance = distanceToSegment(x, y, path.points[pointIndex - 1], path.points[pointIndex]);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestRegion = path.region;
          }
        }
      }
      return bestRegion;
    }

    function updateDetail(region) {
      var detail = REGION_DETAILS[region];
      if (!detail) {
        detailName.textContent = "Explore the brain";
        detailText.textContent = "Drag to rotate; hover or tap a typographic line to reveal its brain region.";
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
      state.pitch = -0.045;
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

    if (window.ResizeObserver) {
      new ResizeObserver(function () { state.dirty = true; resize(); }).observe(stage);
    } else {
      window.addEventListener("resize", function () { state.dirty = true; });
    }

    function animate(time) {
      var elapsed = Math.min(48, time - (state.lastTick || time));
      state.lastTick = time;
      if (!reducedMotion && !state.dragging && !state.pinned && !state.hover) {
        state.yaw += elapsed * 0.0001;
        state.dirty = true;
      }
      if (state.dirty && (state.dragging || time - state.lastFrame > 32)) {
        draw();
        state.dirty = false;
        state.lastFrame = time;
      }
      window.requestAnimationFrame(animate);
    }

    resize();
    draw();
    window.requestAnimationFrame(animate);
  });
})();
