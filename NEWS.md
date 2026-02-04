# quarto-roughnotation (development version)

## New Features

### Flourish Integration

* Added bridge script to enable code chunk annotations when used with the
  [flourish](https://github.com/kbodwin/flourish) extension.

* Use flourish's `style` option to pass roughnotation config via CSS custom
  properties (e.g., `--rn-type: circle; --rn-color: red;`).

* Added `example-flourish.qmd` demonstrating the integration.

### Fragment-based Triggering

* Added new `.rn-fragment` class for triggering annotations via RevealJS fragments
  instead of the 'R' key. Annotations now appear/disappear with arrow key navigation,
  integrating naturally with RevealJS's fragment system.

* Use standard `fragment-index` attribute to control annotation order.

* Text remains visible at all times - only the annotation effect appears/disappears.

### Animated Hide

* Annotations now animate in reverse when hidden (navigating backwards through
  fragments). This uses the `animateOnHide` feature from rough-notation PR #88.

### New Options Support

* `rn-padding` - Set space around the annotated element in pixels. Accepts single
  value or comma-separated values for each side.

* `rn-brackets` - For `rn-type=bracket`, specify which sides to draw brackets on.

  Options: `left`, `right`, `top`, `bottom`. Can be combined with commas.

### New Annotation Type

* `rn-type=bracket` - Draw brackets around elements. Use with `rn-brackets` to
  control which sides.

## Improvements

* Annotations now correctly reposition when the browser window is resized.
  RevealJS uses CSS transforms to scale presentations, and annotations now
  compensate for this scaling.

* Improved code quality: consistent naming conventions, named constants for
  default values, JSDoc documentation, and cleaner control flow.

## Documentation

* Comprehensive example presentation covering all options with live demos.

* Each option has its own slide showing span and div usage examples.

* Added color formats slide demonstrating hex, RGB, RGBA, and named colors.

* Added DEV.md with instructions for updating the rough-notation library.

## Breaking Changes

* `rn-rtl` now defaults to `false` (was incorrectly defaulting to `true`).
  Set `rn-rtl=true` explicitly for right-to-left animation.

## Dependencies

* Updated rough-notation library to include animated hide feature from
  [PR #88](https://github.com/rough-stuff/rough-notation/pull/88).
