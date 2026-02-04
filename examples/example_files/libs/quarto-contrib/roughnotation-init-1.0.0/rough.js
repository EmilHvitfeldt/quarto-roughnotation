document.addEventListener("DOMContentLoaded", function () {
  // Default values
  const DEFAULT_PADDING = 5;
  const DEFAULT_ANIMATION_DURATION = 800;
  const DEFAULT_STROKE_WIDTH = 1;
  const DEFAULT_ITERATIONS = 2;
  const RESIZE_DEBOUNCE_MS = 50;

  // Counter for R-key sequential triggering
  let rnCounter = 0;

  // Store annotations for fragment-based triggering
  const fragmentAnnotations = new Map();

  Reveal.on("slidechanged", () => {
    rnCounter = 0;
  });

  /**
   * Parse a boolean attribute from a data attribute string.
   * Returns true unless the value is exactly "false".
   */
  function parseBooleanAttr(value) {
    return value !== "false";
  }

  /**
   * Parse padding value (can be single number or comma-separated array).
   */
  function parsePadding(value) {
    if (!value) return DEFAULT_PADDING;
    if (value.includes(",")) {
      return value.split(",").map(v => parseInt(v.trim(), 10));
    }
    return parseInt(value, 10);
  }

  /**
   * Parse brackets value (can be single string or comma-separated array).
   */
  function parseBrackets(value) {
    if (!value) return "right";
    if (value.includes(",")) {
      return value.split(",").map(v => v.trim());
    }
    return value;
  }

  /**
   * Create RoughNotation options object from an element's data attributes.
   * @param {HTMLElement} el - The element to annotate
   * @param {boolean} [animateOverride] - Optional override for animate option
   */
  function getAnnotationOptions(el, animateOverride) {
    const options = {
      type: el.dataset.rnType || "highlight",
      animate: animateOverride !== undefined ? animateOverride : parseBooleanAttr(el.dataset.rnAnimate),
      animateOnHide: true,
      animationDuration: parseInt(el.dataset.rnAnimationduration, 10) || DEFAULT_ANIMATION_DURATION,
      color: el.dataset.rnColor || "#fff17680",
      strokeWidth: parseInt(el.dataset.rnStrokewidth, 10) || DEFAULT_STROKE_WIDTH,
      multiline: parseBooleanAttr(el.dataset.rnMultiline),
      iterations: parseInt(el.dataset.rnIterations, 10) || DEFAULT_ITERATIONS,
      rtl: el.dataset.rnRtl === "true",
      padding: parsePadding(el.dataset.rnPadding),
    };

    if (options.type === "bracket") {
      options.brackets = parseBrackets(el.dataset.rnBrackets);
    }

    return options;
  }

  /**
   * Apply inverse scale transform to annotation SVG to counteract RevealJS scaling.
   * RevealJS uses CSS transforms to scale slides, which affects annotation positioning.
   */
  function applyInverseScale(annotation) {
    if (annotation._svg) {
      const scale = Reveal.getScale();
      annotation._svg.style.transform = `scale(${1 / scale})`;
      annotation._svg.style.transformOrigin = "top left";
    }
  }

  // R-key binding for legacy annotation triggering
  Reveal.addKeyBinding(
    { keyCode: 82, key: "R", description: "Trigger RoughNotation" },
    function () {
      rnCounter += 1;

      const slide = Reveal.getCurrentSlide();
      const elements = Array.from(slide.querySelectorAll(".rn"));

      const annotations = elements
        .filter(function (el) {
          const index = el.dataset.rnIndex;
          if (rnCounter === 1) {
            // First press: show elements without index or with index=1
            return !index || parseInt(index, 10) <= 1;
          } else {
            // Subsequent presses: show elements with matching index
            return parseInt(index, 10) === rnCounter;
          }
        })
        .map(function (el) {
          return RoughNotation.annotate(el, getAnnotationOptions(el));
        });

      annotations.forEach(function (annotation) {
        annotation.show();
      });
    }
  );

  // Fragment-based annotation: show on fragment reveal
  Reveal.on("fragmentshown", (event) => {
    const fragment = event.fragment;
    if (!fragment.classList.contains("rn-fragment")) return;

    // Create annotation if not already created
    if (!fragmentAnnotations.has(fragment)) {
      const annotation = RoughNotation.annotate(fragment, getAnnotationOptions(fragment));
      fragmentAnnotations.set(fragment, annotation);
    }

    const annotation = fragmentAnnotations.get(fragment);
    annotation.show();
    applyInverseScale(annotation);
  });

  // Fragment-based annotation: hide on fragment hide
  Reveal.on("fragmenthidden", (event) => {
    const fragment = event.fragment;
    if (!fragment.classList.contains("rn-fragment")) return;
    if (!fragmentAnnotations.has(fragment)) return;

    const annotation = fragmentAnnotations.get(fragment);
    annotation.hide();
  });

  // Update annotation positions when presentation is resized
  let resizeTimeout;
  Reveal.on("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      fragmentAnnotations.forEach((annotation) => {
        applyInverseScale(annotation);
      });
    }, RESIZE_DEBOUNCE_MS);
  });
});
