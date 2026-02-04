document.addEventListener("DOMContentLoaded", function () {
  var rn_counter = 0;

  // Store annotations for fragment-based triggering
  var fragmentAnnotations = new Map();
  // Store pending hide timeouts to allow cancellation
  var pendingHideTimeouts = new Map();

  Reveal.on("slidechanged", (event) => {
    rn_counter = 0;
  });

  function strictly_false(x) {
    var out = true;
    if (x === "false") {
      out = false;
    }
    return out;
  }

  // Helper to parse padding (can be single number or comma-separated array)
  function parsePadding(value) {
    if (!value) return 5;
    if (value.includes(",")) {
      return value.split(",").map(v => parseInt(v.trim()));
    }
    return parseInt(value);
  }

  // Helper to parse brackets (can be single string or comma-separated array)
  function parseBrackets(value) {
    if (!value) return "right";
    if (value.includes(",")) {
      return value.split(",").map(v => v.trim());
    }
    return value;
  }

  // Helper to create annotation options from an element
  function getAnnotationOptions(el, animate) {
    const options = {
      type: el.dataset.rnType || "highlight",
      animate: animate !== undefined ? animate : strictly_false(el.dataset.rnAnimate),
      animationDuration: parseInt(el.dataset.rnAnimationduration) || 800,
      color: el.dataset.rnColor || "#fff17680",
      strokeWidth: parseInt(el.dataset.rnStrokewidth) || 1,
      multiline: strictly_false(el.dataset.rnMultiline),
      iterations: parseInt(el.dataset.rnIterations) || 2,
      rtl: !strictly_false(el.dataset.rnRtl),
      padding: parsePadding(el.dataset.rnPadding),
    };

    // Add brackets option only for bracket type
    if (options.type === "bracket") {
      options.brackets = parseBrackets(el.dataset.rnBrackets);
    }

    return options;
  }

  // Apply inverse scale to SVG to counteract RevealJS transform
  function applyInverseScale(annotation) {
    if (annotation._svg) {
      const scale = Reveal.getScale();
      annotation._svg.style.transform = `scale(${1 / scale})`;
      annotation._svg.style.transformOrigin = "top left";
    }
  }

  Reveal.addKeyBinding(
    { keyCode: 82, key: "R", description: "Trigger RoughNotation" },
    function () {
      rn_counter = rn_counter + 1;

      const slide = Reveal.getCurrentSlide();
      const divs = Array.from(slide.querySelectorAll(".rn"));
      const new_divs = divs
        .filter(function (rn) {
          if (rn_counter == 1) {
            if (rn.dataset.rnIndex > 1) {
              return false;
            }
          } else {
            if (typeof rn.dataset.rnIndex == "undefined") {
              return false;
            }
            if (rn.dataset.rnIndex != rn_counter) {
              return false;
            }
          }
          return true;
        })
        .map(function (rn) {
          return RoughNotation.annotate(rn, getAnnotationOptions(rn));
        });

      new_divs.map(function (rn) {
        rn.show();
      });
    }
  );

  // Fragment-based annotation triggering
  Reveal.on("fragmentshown", (event) => {
    const fragment = event.fragment;
    if (fragment.classList.contains("rn-fragment")) {
      // Cancel any pending hide timeout
      if (pendingHideTimeouts.has(fragment)) {
        clearTimeout(pendingHideTimeouts.get(fragment));
        pendingHideTimeouts.delete(fragment);
      }

      // Create annotation if not already created
      if (!fragmentAnnotations.has(fragment)) {
        const annotation = RoughNotation.annotate(fragment, getAnnotationOptions(fragment));
        fragmentAnnotations.set(fragment, annotation);
      }

      const annotation = fragmentAnnotations.get(fragment);
      // Reset SVG opacity in case it was mid-fade
      if (annotation._svg) {
        annotation._svg.style.transition = "";
        annotation._svg.style.opacity = "";
      }
      annotation.show();
      applyInverseScale(annotation);
    }
  });

  Reveal.on("fragmenthidden", (event) => {
    const fragment = event.fragment;
    if (fragment.classList.contains("rn-fragment") && fragmentAnnotations.has(fragment)) {
      const annotation = fragmentAnnotations.get(fragment);
      const svg = annotation._svg;
      if (svg) {
        const duration = parseInt(fragment.dataset.rnAnimationduration) || 800;
        svg.style.transition = `opacity ${duration}ms ease-out`;
        svg.style.opacity = "0";
        const timeoutId = setTimeout(() => {
          pendingHideTimeouts.delete(fragment);
          annotation.hide();
          svg.style.transition = "";
          svg.style.opacity = "";
        }, duration);
        pendingHideTimeouts.set(fragment, timeoutId);
      } else {
        annotation.hide();
      }
    }
  });

  // Handle resize - update inverse scale on all annotations
  var resizeTimeout;
  Reveal.on("resize", (event) => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      fragmentAnnotations.forEach((annotation, fragment) => {
        applyInverseScale(annotation);
      });
    }, 50);
  });
})
