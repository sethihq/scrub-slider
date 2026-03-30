# scrub-slider

A slider with scrub sounds and haptic feedback.

[Live Demo](https://scrub-slider.vercel.app) · [npm](https://www.npmjs.com/package/@sethihq/scrub-slider)

## Install

```bash
npm i @sethihq/scrub-slider
```

## Usage

```tsx
import { Slider } from "@/components/ui/slider";

<Slider
  label="Frequency"
  value={frequency}
  onValueChange={setFrequency}
  min={0}
  max={1}
  step={0.01}
/>
```

## Props

### Core

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number` | Current value |
| `onValueChange` | `(v: number) => void` | Change handler |
| `min` | `number` | Minimum value |
| `max` | `number` | Maximum value |
| `step` | `number` | Step increment |

### Display

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| `unit` | `string` | — | Unit suffix (e.g. "%") |
| `chipPosition` | `"top" \| "bottom"` | `"top"` | Hover chip position |

### Feedback

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableSound` | `boolean` | `true` | Scrub sounds |
| `enableHaptics` | `boolean` | `true` | Haptic feedback |

## CSS Tokens

```css
:root {
  --surface: #ffffff;       /* Track background */
  --on-surface: #0a0a0a;   /* Thumb indicator */
  --on-surface-muted: #737373; /* Label, fills */
  --outline: #e5e5e5;      /* Track border */
  --chip: #a3a3a3;         /* Hover chip bg */
  --on-chip: #fafafa;      /* Hover chip text */
}
```

## License

MIT
