# Visual Treatment Guide - Action Images

This folder contains visual reference images for treatment steps.

## Required Images:

Place the following images in this folder:

1. **spray.jpg** - Image showing farmer spraying crops with pesticide/fungicide
   - Recommended size: 400x400px minimum
   - Shows proper spraying technique

2. **cut.jpg** - Image showing pruning or cutting diseased leaves
   - Recommended size: 400x400px minimum
   - Shows proper cutting/pruning technique

3. **mix.jpg** - Image showing mixing of fertilizer or medicine
   - Recommended size: 400x400px minimum
   - Shows proper mixing technique in bucket/container

4. **water.jpg** - Image showing proper watering of plants
   - Recommended size: 400x400px minimum
   - Shows irrigation or manual watering

5. **default.jpg** - Default fallback image for any action
   - Recommended size: 400x400px minimum
   - General farming activity image

## Image Guidelines:

- **Format**: JPG (preferred) or PNG
- **Size**: Minimum 400x400px, maximum 1200x1200px
- **Aspect Ratio**: Square (1:1) preferred
- **Quality**: Clear, well-lit images showing the action being performed
- **Subject**: Focus on the action itself with minimal background distraction
- **File Size**: Keep under 500KB per image for fast loading

## Current Status:

The component will display a fallback to `default.jpg` if specific action images are not found.

## Usage in Component:

```typescript
const ACTION_IMAGES: Record<string, string> = {
  spray: '/actions/spray.jpg',
  cut: '/actions/cut.jpg',
  mix: '/actions/mix.jpg',
  water: '/actions/water.jpg',
  // ... other mappings fall back to default.jpg
};
```

Images are displayed as 96x96px (w-24 h-24) thumbnails with rounded corners and shadows.
