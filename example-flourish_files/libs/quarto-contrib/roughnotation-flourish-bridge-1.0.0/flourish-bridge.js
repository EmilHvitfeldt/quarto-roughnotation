/**
 * Bridge script to connect flourish extension with roughnotation.
 *
 * Usage: In flourish chunk options, add CSS custom properties:
 *
 * #| flourish:
 * #|   - target: "mean"
 * #|     style: "--rn-type: circle; --rn-color: red;"
 *
 * Supported custom properties:
 *   --rn-type: highlight, underline, box, circle, strike-through, crossed-off, bracket
 *   --rn-color: any CSS color
 *   --rn-animate: true/false
 *   --rn-animationDuration: milliseconds
 *   --rn-strokeWidth: pixels
 *   --rn-padding: pixels (or comma-separated for each side)
 *   --rn-multiline: true/false
 *   --rn-iterations: number
 *   --rn-brackets: left, right, top, bottom (comma-separated)
 *   --rn-rtl: true/false
 *   --rn-index: fragment order index
 */

document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit for flourish to process the DOM first
  setTimeout(initFlourishBridge, 100);
});

function initFlourishBridge() {
  // Find all flourish-created spans (classes starting with flr-)
  const flourishElements = document.querySelectorAll('[class*="flr-"]');

  flourishElements.forEach((el, index) => {
    const style = getComputedStyle(el);

    // Check if this element has roughnotation custom properties
    const rnType = style.getPropertyValue('--rn-type').trim();

    if (!rnType) return; // No roughnotation config, skip

    // Add the rn-fragment class for roughnotation to pick up
    el.classList.add('rn-fragment');
    el.classList.add('fragment'); // RevealJS fragment class

    // Map CSS custom properties to data attributes
    const propertyMappings = {
      '--rn-type': 'rnType',
      '--rn-color': 'rnColor',
      '--rn-animate': 'rnAnimate',
      '--rn-animationDuration': 'rnAnimationduration',
      '--rn-strokeWidth': 'rnStrokewidth',
      '--rn-padding': 'rnPadding',
      '--rn-multiline': 'rnMultiline',
      '--rn-iterations': 'rnIterations',
      '--rn-brackets': 'rnBrackets',
      '--rn-rtl': 'rnRtl',
      '--rn-index': 'rnIndex'
    };

    Object.entries(propertyMappings).forEach(([cssProperty, dataAttr]) => {
      const value = style.getPropertyValue(cssProperty).trim();
      if (value) {
        el.dataset[dataAttr] = value;
      }
    });

    // Set fragment-index if --rn-index is specified, otherwise use order
    const rnIndex = style.getPropertyValue('--rn-index').trim();
    if (rnIndex) {
      el.dataset.fragmentIndex = rnIndex;
    }

    // Clear the flourish background style so roughnotation can work cleanly
    // (unless the user wants to keep it)
    const keepBg = style.getPropertyValue('--rn-keep-bg').trim();
    if (keepBg !== 'true') {
      el.style.backgroundColor = 'transparent';
    }
  });

  // Dispatch a custom event to signal bridge is ready
  document.dispatchEvent(new CustomEvent('flourish-bridge-ready'));
}
