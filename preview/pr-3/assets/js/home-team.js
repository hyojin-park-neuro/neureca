(function () {
      "use strict";

      var root = document.getElementById("neureca-outward-labels-repaired-photos-v26");
      if (!root) return;

      var section = root.querySelector(".v26-team");
      var stage = root.querySelector("#v26-team-stage");
      var members = Array.prototype.slice.call(root.querySelectorAll(".v26-member"));
      if (!section || !stage || !members.length) return;

      function interleaveMembers(list) {
        var center = list.find(function (member) {
          return member.getAttribute("data-name") === "Hyojin Park";
        }) || list[0];
        var photos = list.filter(function (member) {
          return member !== center && !member.classList.contains("is-placeholder");
        });
        var placeholders = list.filter(function (member) {
          return member !== center && member.classList.contains("is-placeholder");
        });
        var ordered = [center];
        var count = Math.max(photos.length, placeholders.length);

        for (var index = 0; index < count; index += 1) {
          if (photos[index]) ordered.push(photos[index]);
          if (placeholders[index]) ordered.push(placeholders[index]);
        }

        ordered.forEach(function (member) { stage.appendChild(member); });
        return ordered;
      }

      function placeMember(member, x, y) {
        member.style.setProperty("--member-x", x + "%");
        member.style.setProperty("--member-y", y + "%");
      }

      function spread(count, start, end) {
        var values = [];
        for (var index = 0; index < count; index += 1) {
          values.push(count === 1 ? (start + end) / 2 : start + ((end - start) * index / (count - 1)));
        }
        return values;
      }

      function placeVerticalSplit(list, x, sideClass) {
        var topCount = Math.floor(list.length / 2);
        var bottomCount = list.length - topCount;
        var verticalY = spread(topCount, 7, 40).concat(spread(bottomCount, 60, 93));

        list.forEach(function (member, index) {
          member.classList.add(sideClass);
          placeMember(member, x, verticalY[index]);
        });
      }

      function assignHLayout() {
        var total = members.length;
        var crossCount = total >= 18 ? 7 : total >= 10 ? 5 : Math.min(3, total);
        var centerIndex = Math.floor(crossCount / 2);
        var crossX = [];
        var crossMembers = [members[0]].concat(members.slice(1, crossCount));
        var center = crossMembers.shift();

        members.forEach(function (member) {
          member.classList.remove(
            "is-crossbar",
            "is-left-stem",
            "is-right-stem",
            "is-left-junction",
            "is-right-junction",
            "is-label-lower",
            "has-label-above"
          );
        });

        for (var index = 0; index < crossCount; index += 1) {
          crossX.push(crossCount === 1 ? 50 : 24 + (52 * index / (crossCount - 1)));
        }

        placeMember(center, 50, 50);
        center.classList.add("is-crossbar");
        crossX.splice(centerIndex, 1);
        crossMembers.forEach(function (member, index) {
          var x = crossX[index];
          member.classList.add("is-crossbar");
          if (x === 24) member.classList.add("is-left-junction");
          if (x === 76) member.classList.add("is-right-junction");
          if (index === 2 || index === 3) member.classList.add("is-label-lower");
          placeMember(member, x, 50);
        });

        var left = [];
        var right = [];
        members.slice(crossCount).forEach(function (member, index) {
          var row = Math.floor(index / 2);
          var useLeft = index % 2 === 0 ? row % 2 === 0 : row % 2 !== 0;
          (useLeft ? left : right).push(member);
        });
        placeVerticalSplit(left, 24, "is-left-stem");
        placeVerticalSplit(right, 76, "is-right-stem");
      }

      members = interleaveMembers(members);
      assignHLayout();
      stage.classList.add("is-enhanced");

      var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var compact = window.matchMedia && window.matchMedia("(max-width: 560px)").matches;
      var started = false;
      var timers = [];
      var stepDuration = 1150;
      var holdDuration = 6500;
      var resetDuration = 1200;

      function schedule(callback, delay) {
        timers.push(window.setTimeout(callback, delay));
      }

      function clearTimers() {
        timers.forEach(function (timer) { window.clearTimeout(timer); });
        timers = [];
      }

      function showFinal() {
        clearTimers();
        members.forEach(function (member) {
          member.classList.remove("is-queued", "is-featured");
          member.classList.add("is-settled");
        });
        stage.classList.add("is-complete");

        if (!reducedMotion && !compact) {
          schedule(resetSequence, holdDuration);
        }
      }

      function playSequence() {
        clearTimers();
        stage.classList.remove("is-complete");
        members.forEach(function (member) {
          member.classList.remove("is-featured", "is-settled");
          member.classList.add("is-queued");
        });

        members.forEach(function (member, index) {
          schedule(function () {
            if (index > 0) {
              members[index - 1].classList.remove("is-featured");
              members[index - 1].classList.add("is-settled");
            }
            member.classList.remove("is-queued");
            member.classList.add("is-featured");
          }, index * stepDuration);
        });

        schedule(showFinal, members.length * stepDuration + 760);
      }

      function resetSequence() {
        clearTimers();
        stage.classList.remove("is-complete");
        members.forEach(function (member) {
          member.classList.remove("is-featured", "is-settled");
          member.classList.add("is-queued");
        });
        schedule(playSequence, resetDuration);
      }

      function startSequence() {
        if (started) return;
        started = true;

        if (reducedMotion || compact) {
          showFinal();
          return;
        }

        playSequence();
      }

      window.setTimeout(startSequence, 900);
    }());
