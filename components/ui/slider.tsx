"use client";

import { forwardRef, useRef, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";
import { useSound } from "@/hooks/use-sound";

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit?: string;
  className?: string;
  chipPosition?: "top" | "bottom";
  enableSound?: boolean;
  enableHaptics?: boolean;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, min, max, step, label, unit, className, chipPosition = "top", enableSound = true, enableHaptics = true }, ref) => {
    const { trigger } = useHaptics();
    const { playScrub } = useSound();
    const pct = ((value - min) / (max - min)) * 100;
    const trackRef = useRef<HTMLSpanElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const chipRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const [isDraggingState, setIsDraggingState] = useState(false);
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Update hover fill to match current value while dragging
    const updateHoverFillToValue = () => {
      const track = trackRef.current;
      if (!track || !hoverRef.current) return;
      const width = track.getBoundingClientRect().width;
      hoverRef.current.style.width = `${12 + (width - 24) * (pct / 100)}px`;
      hoverRef.current.style.opacity = "1";
    };

    const handlePointerEnter = () => {
      if (!isDragging.current) {
        if (hoverRef.current) hoverRef.current.style.opacity = "1";
        if (chipRef.current) chipRef.current.style.opacity = "1";
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      const track = trackRef.current;
      if (!track) return;

      // During drag, don't show chip or update hover fill from pointer
      // (hover fill follows the actual value instead — see useEffect below)
      if (isDragging.current) return;

      const rect = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

      // Position chip via ref (fast, no re-render)
      if (chipRef.current) chipRef.current.style.left = `${x}px`;

      // Value via state (triggers NumberFlow animation)
      const ratio = x / rect.width;
      const interpolated =
        Math.round((min + ratio * (max - min)) / step) * step;
      setHoverValue(interpolated);

      // Hover fill follows pointer
      if (hoverRef.current) hoverRef.current.style.width = `${x}px`;
    };

    const handlePointerLeave = () => {
      if (!isDragging.current) {
        if (hoverRef.current) hoverRef.current.style.opacity = "0";
        if (chipRef.current) chipRef.current.style.opacity = "0";
        setHoverValue(null);
      }
    };

    const handlePointerDown = () => {
      isDragging.current = true;
      setIsDraggingState(true);
      // Hide chip during drag, but keep hover fill visible
      if (chipRef.current) chipRef.current.style.opacity = "0";
      updateHoverFillToValue();
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-center justify-between px-2">
          <label className="text-[13px] text-[var(--on-surface-muted)] select-none">
            {label}
          </label>
          <span className="inline-flex items-baseline text-[13px] font-mono font-medium text-[var(--on-surface)] tabular-nums">
            <NumberFlow value={value} />
            {unit && <span className="ml-0.5 text-[var(--on-surface-muted)]">{unit}</span>}
          </span>
        </div>
        <SliderPrimitive.Root
          aria-label={label}
          className="relative flex h-8 w-full touch-none select-none items-center"
          value={[value]}
          onValueChange={([v]) => {
            if (enableSound) playScrub(v);
            onValueChange(v);
            // Update hover fill to follow value during drag
            if (isDragging.current) {
              const track = trackRef.current;
              if (track && hoverRef.current) {
                const newPct = ((v - min) / (max - min)) * 100;
                const width = track.getBoundingClientRect().width;
                hoverRef.current.style.width = `${12 + (width - 24) * (newPct / 100)}px`;
              }
            }
          }}
          onValueCommit={() => {
            if (enableHaptics) trigger("selection");
            isDragging.current = false;
            setIsDraggingState(false);
            // Hide hover fill after drag ends
            if (hoverRef.current) hoverRef.current.style.opacity = "0";
          }}
          min={min}
          max={max}
          step={step}
        >
          {/* Hover value chip */}
          <div
            ref={chipRef}
            className={cn(
              "pointer-events-none absolute -translate-x-1/2 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
              chipPosition === "top" ? "-top-8" : "-bottom-8"
            )}
            style={{
              backgroundColor: "var(--chip)",
              color: "var(--on-chip)",
              opacity: 0,
              transition: "opacity 150ms ease-out",
              whiteSpace: "nowrap",
            }}
          >
            {hoverValue !== null && <NumberFlow value={hoverValue} />}
          </div>
          <SliderPrimitive.Track
            ref={trackRef}
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            className="relative h-8 w-full grow overflow-hidden rounded-[26px] border border-[var(--outline)]"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            {/* Hover fill — rendered first so it's behind Range and thumb */}
            <div
              ref={hoverRef}
              className="absolute h-full rounded-[26px] pointer-events-none"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--on-surface-muted) 18%, transparent)",
                opacity: 0,
                transition: "opacity 150ms ease-out",
                width: 0,
              }}
            />
            {/* Custom fill — uses same inset formula as thumb for perfect alignment */}
            <div
              className="absolute h-full rounded-[26px] pointer-events-none"
              style={{
                backgroundColor: "color-mix(in srgb, var(--on-surface-muted) 12%, transparent)",
                width: `calc(12px + (100% - 24px) * ${pct / 100})`,
                transition: isDraggingState ? "none" : "width 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            {/* Hidden Radix Range — kept for internal slider mechanics */}
            <SliderPrimitive.Range className="absolute h-full opacity-0" />
            {/* Thumb indicator — lives inside track so it clips at boundaries */}
            <div
              className="pointer-events-none absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: "color-mix(in srgb, var(--on-surface) 50%, transparent)",
                left: `calc(12px + (100% - 24px) * ${pct / 100})`,
                transition: isDraggingState ? "none" : "left 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </SliderPrimitive.Track>
          {/* Invisible Radix thumb — handles drag + a11y */}
          <SliderPrimitive.Thumb
            className="block h-8 w-5 cursor-ew-resize opacity-0"
            aria-label={label}
          />
        </SliderPrimitive.Root>
      </div>
    );
  }
);
Slider.displayName = "Slider";
