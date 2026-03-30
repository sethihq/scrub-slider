# scrub-slider

A slider component with scrub sounds and haptic feedback. Built with Radix UI primitives, NumberFlow for animated values, Web Audio API for sound, and web-haptics for tactile feedback.

[Live Demo](https://scrub-slider.vercel.app/) · [GitHub](https://github.com/sethihq/scrub-slider)

## Features

- Hover value chip with animated number transitions
- Velocity-sensitive scrub sounds via Web Audio API
- Haptic feedback on value commit (mobile)
- Dark/light mode with smooth View Transition crossfade
- Optional sound and haptics via props

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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current value |
| `onValueChange` | `(value: number) => void` | — | Change handler |
| `min` | `number` | — | Minimum value |
| `max` | `number` | — | Maximum value |
| `step` | `number` | — | Step increment |
| `label` | `string` | — | Label text |
| `unit` | `string` | — | Unit suffix (e.g. "%") |
| `chipPosition` | `"top" \| "bottom"` | `"top"` | Hover chip position |
| `enableSound` | `boolean` | `true` | Enable scrub sounds |
| `enableHaptics` | `boolean` | `true` | Enable haptic feedback |

## CSS Tokens

The slider reads these CSS custom properties:

| Token | Description |
|-------|-------------|
| `--surface` | Track background |
| `--on-surface` | Thumb indicator |
| `--on-surface-muted` | Label text, hover/value fills |
| `--outline` | Track border |
| `--chip` | Hover chip background |
| `--on-chip` | Hover chip text |

## Credits

Built with [Claude Code](https://claude.ai/code). Parameters tuned live with [DialKit](https://x.com/joshpuckett/status/2024141004685656447).
