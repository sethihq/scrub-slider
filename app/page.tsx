"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/hooks/use-theme";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="fixed top-5 right-5 z-20 flex size-9 items-center justify-center rounded-full border border-[var(--toolbar-border)] bg-[var(--surface)] text-[var(--page-text)] backdrop-blur-sm cursor-pointer transition-[background-color,border-color,color] duration-200 hover:bg-[var(--surface)] active:scale-[0.97]"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="absolute"
        style={{
          opacity: resolvedTheme === "dark" ? 1 : 0,
          transform: resolvedTheme === "dark" ? "scale(1) rotate(0deg)" : "scale(0.25) rotate(-180deg)",
          filter: resolvedTheme === "dark" ? "blur(0px)" : "blur(4px)",
          transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="absolute"
        style={{
          opacity: resolvedTheme === "light" ? 1 : 0,
          transform: resolvedTheme === "light" ? "scale(1) rotate(0deg)" : "scale(0.25) rotate(180deg)",
          filter: resolvedTheme === "light" ? "blur(0px)" : "blur(4px)",
          transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}

export default function Page() {
  const [frequency, setFrequency] = useState(0.65);
  const [volume, setVolume] = useState(75);
  const [speed, setSpeed] = useState(1.0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--page)] transition-[background-color] duration-300">
      <ThemeToggle />
      <div className="flex w-full max-w-[380px] flex-col items-center gap-10 px-6">
        <div className="flex w-full flex-col gap-6">
          <Slider
            label="Frequency"
            value={frequency}
            onValueChange={setFrequency}
            min={0}
            max={1}
            step={0.01}
          />
          <Slider
            label="Volume"
            value={volume}
            onValueChange={setVolume}
            min={0}
            max={100}
            step={1}
            unit="%"
          />
          <Slider
            label="Speed"
            value={speed}
            onValueChange={setSpeed}
            min={0.1}
            max={2.0}
            step={0.01}
          />
        </div>
        <a
          href="https://github.com/sethihq/scrub-slider"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[var(--page-text-muted)] transition-colors duration-200 hover:text-[var(--page-text)]"
        >
          scrub-slider
        </a>
      </div>
    </div>
  );
}
