document.addEventListener("DOMContentLoaded", function () {
  var rn_counter = 0;

  // Store annotations for fragment-based triggering
  var fragmentAnnotations = new Map();

  Reveal.on("slidechanged", (event) => {
    rn_counter = 0;
    fragmentAnnotations.clear();
  });

  function strictly_false(x) {
    var out = true;
    if (x === "false") {
      out = false;
    }
    return out;
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
          return RoughNotation.annotate(rn, {
            type: rn.dataset.rnType || "highlight",
            animate: strictly_false(rn.dataset.rnAnimate),
            animationDuration: parseInt(rn.dataset.rnAnimationduration) || 800,
            color: rn.dataset.rnColor || "#fff17680",
            strokeWidth: parseInt(rn.dataset.rnStrokewidth) || 1,
            multiline: strictly_false(rn.dataset.rnMultiline),
            iterations: parseInt(rn.dataset.rnIterations) || 2,
            rtl: !strictly_false(rn.dataset.rnRtl),
          });
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
      // Create annotation if not already created
      if (!fragmentAnnotations.has(fragment)) {
        const annotation = RoughNotation.annotate(fragment, {
          type: fragment.dataset.rnType || "highlight",
          animate: strictly_false(fragment.dataset.rnAnimate),
          animationDuration: parseInt(fragment.dataset.rnAnimationduration) || 800,
          color: fragment.dataset.rnColor || "#fff17680",
          strokeWidth: parseInt(fragment.dataset.rnStrokewidth) || 1,
          multiline: strictly_false(fragment.dataset.rnMultiline),
          iterations: parseInt(fragment.dataset.rnIterations) || 2,
          rtl: !strictly_false(fragment.dataset.rnRtl),
        });
        fragmentAnnotations.set(fragment, annotation);
      }
      fragmentAnnotations.get(fragment).show();
    }
  });

  Reveal.on("fragmenthidden", (event) => {
    const fragment = event.fragment;
    if (fragment.classList.contains("rn-fragment") && fragmentAnnotations.has(fragment)) {
      fragmentAnnotations.get(fragment).hide();
    }
  });
})
