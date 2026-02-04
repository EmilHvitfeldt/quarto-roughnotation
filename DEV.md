# Development Notes

## RoughNotation Library

This extension uses a modified version of the [RoughNotation](https://github.com/rough-stuff/rough-notation) library.

### Current Version

We use the version from [PR #88](https://github.com/rough-stuff/rough-notation/pull/88) which adds the `animateOnHide` feature for smooth reverse animations when hiding annotations.

### How to Update the Library

1. Clone the PR branch:
   ```bash
   git clone --depth 1 --branch feature/animated-hide https://github.com/BeksOmega/rough-notation.git /tmp/rough-notation-pr88
   ```

2. Install dependencies and build:
   ```bash
   cd /tmp/rough-notation-pr88
   npm install
   npm run build
   ```

3. Copy the built file to the extension:
   ```bash
   cp /tmp/rough-notation-pr88/lib/rough-notation.iife.js _extensions/roughnotation/assets/rough-notation.iife.js
   ```

4. Clean up:
   ```bash
   rm -rf /tmp/rough-notation-pr88
   ```

### If PR #88 Gets Merged

Once PR #88 is merged into the main rough-notation repository and a new version is released, you can update to the official version:

1. Download the latest release from https://github.com/rough-stuff/rough-notation/releases
2. Copy `rough-notation.iife.js` to `_extensions/roughnotation/assets/`

### Key Features Used from PR #88

- `animateOnHide: true` - Enables reverse animation when calling `annotation.hide()`

This eliminates the need for custom fade-out logic in `rough.js`.
