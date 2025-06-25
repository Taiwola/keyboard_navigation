# Keyboard Navigation Utility

## Overview
`nagivaitionAZ.js` is a vanilla JavaScript utility for keyboard-only navigation, designed for accessibility across various websites, including those with dynamic content. It allows users to navigate headers (`<h1>`–`<h6>`), links (`<a>`), and landmarks (semantic tags and ARIA roles) using hotkeys and directional controls.

## How It Works
1. **Initialization**: Call `initKeyboardNav()` to start the utility.
2. **Element Scanning**:
   - Collects headers, links, and landmarks on page load.
   - Uses `MutationObserver` to update element lists when the DOM changes.
3. **Hotkey Navigation**:
   - `H`: Next/previous header.
   - `L`: Next/previous link.
   - `M`: Next/previous landmark.
   - Ignored when form fields (`input`, `textarea`, `select`) are focused.
4. **Directional Navigation**:
   - `ArrowDown`: Sets forward direction.
   - `ArrowUp`: Sets backward direction.
   - Direction applies to subsequent `H`, `L`, `M` presses.
5. **Visual Highlighting**:
   - Applies high-contrast CSS (black border, bright yellow background).
   - Clears styles from previous elements.
6. **Cleanup**: Returns a cleanup function to remove the observer and styles.

## Assumptions
- Semantic tags (`nav`, `main`, etc.) are landmarks even without ARIA roles.
- Cycling to first/last element occurs when no next/previous element exists.

## Accessibility Rules Applied
  - **(Keyboard)**: All navigation is keyboard-accessible.
  - **(Focus Visible)**: High-contrast visual indicator for focused elements.
  - **(Contrast Minimum)**: Black border and yellow background ensure visibility.
- Avoids `tabindex` on non-interactive elements to prevent screen reader confusion.
- Ignores hotkeys when form fields are focused to respect user input context.

## Usage
1. Include the script:
   ```html
    <script>
        initKeyboardNav()
    </script>
   ```