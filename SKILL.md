---
name: scrub-slider
description: A slider component with scrub sounds and haptic feedback. Use when building sliders, range inputs, or audio/haptic UI. Provides Slider component API, CSS token setup, and hook usage for sound and haptics.
license: MIT
metadata:
  author: sethihq
  version: "0.2.1"
---

# scrub-slider

A slider component with scrub sounds and haptic feedback. Built with Radix UI, NumberFlow, Web Audio API, and web-haptics.

## Install

```bash
npm install @sethihq/scrub-slider
```

Peer dependencies: `react`, `react-dom`, `@radix-ui/react-slider`, `@number-flow/react`, `web-haptics`, `clsx`, `tailwind-merge`

## Files to Copy

Copy these into your project:

| File | Purpose |
|------|---------|
| `slider.tsx` | The slider component |
| `use-sound.ts` | Web Audio scrub sound hook (base64 MP3, no external files) |
| `use-haptics.ts` | web-haptics wrapper hook |
| `utils.ts` | `cn()` utility (clsx + tailwind-merge) |

## Slider Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Current value |
| `onValueChange` | `(v: number) => void` | — | Yes | Change handler |
| `min` | `number` | — | Yes | Minimum value |
| `max` | `number` | — | Yes | Maximum value |
| `step` | `number` | — | Yes | Step increment |
| `label` | `string` | — | Yes | Label text |
| `unit` | `string` | — | No | Unit suffix (e.g. "%") |
| `chipPosition` | `"top" \| "bottom"` | `"top"` | No | Hover chip position |
| `showChip` | `boolean` | `true` | No | Show/hide hover chip |
| `enableSound` | `boolean` | `true` | No | Enable scrub sounds |
| `enableHaptics` | `boolean` | `true` | No | Enable haptic feedback |
| `className` | `string` | — | No | Additional class names |

## Usage

```tsx
import { Slider } from "@sethihq/scrub-slider";

const [value, setValue] = useState(0.5);

<Slider
  label="Frequency"
  value={value}
  onValueChange={setValue}
  min={0}
  max={1}
  step={0.01}
/>
```

### With optional props

```tsx
<Slider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
  unit="%"
  chipPosition="bottom"
  enableSound={false}
  enableHaptics={false}
/>
```

## CSS Tokens

The slider reads these CSS custom properties. Define them in your global CSS:

```css
:root {
  --surface: #ffffff;            /* Track background */
  --on-surface: #0a0a0a;        /* Thumb indicator  */
  --on-surface-muted: #737373;  /* Label, fills     */
  --outline: #e5e5e5;           /* Track border     */
  --chip: #a3a3a3;              /* Hover chip bg    */
  --on-chip: #fafafa;           /* Hover chip text  */
}

/* Dark mode */
.dark {
  --surface: #0a0a0a;
  --on-surface: #fafafa;
  --on-surface-muted: #a1a1a1;
  --outline: rgba(255, 255, 255, 0.1);
  --chip: #404040;
  --on-chip: #e8e8e8;
}
```

## Hooks

### useSound

```tsx
import { useSound } from "@sethihq/scrub-slider/use-sound";

const { playScrub } = useSound();
// Call playScrub(value) on slider change for scrub audio
```

### useHaptics

```tsx
import { useHaptics } from "@sethihq/scrub-slider/use-haptics";

const { trigger } = useHaptics();
// Call trigger("selection") on value commit for haptic feedback
```

## Key Implementation Details

- **Hover chip**: Shows interpolated value on pointer hover with 200ms entrance delay. Uses NumberFlow for animated digits. Hides during drag.
- **Scrub sound**: Web Audio API with base64-encoded MP3. No external audio files needed. Pitch varies with slider value.
- **Haptic feedback**: Uses `web-haptics` library. Triggers on value commit (pointer up), not during drag.
- **Thumb**: Invisible Radix thumb handles drag + a11y. Visual thumb indicator is a separate div clipped inside the track.
- **Fill layers**: Two fill layers — a subtle value fill and a hover preview fill. Both use `color-mix()` for transparency.
- **Concentric radius**: Track uses `rounded-[26px]`, inner fills use `rounded-[25px]` to account for 1px border.
- **Transitions**: Smooth 300ms cubic-bezier during programmatic changes, instant (`transition: none`) during drag for responsiveness.

## Do NOT

- Do not wrap the Slider in a form element — it uses Radix primitives internally
- Do not set `width` on the Slider — it fills its container. Control width via the parent
- Do not forget CSS tokens — the slider will be invisible without them
- Do not use `memo` or `useMemo` — the component is designed for React 19+ with React Compiler
