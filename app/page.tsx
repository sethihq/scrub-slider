"use client";

import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/hooks/use-theme";
import { MadeWithLove } from "@/components/made-with-love";

/* ── Theme Toggle ──────────────────────────────────── */

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex size-9 items-center justify-center rounded-full border border-[var(--toolbar-border)] bg-[var(--surface)] text-[var(--page-text)] backdrop-blur-sm cursor-pointer transition-[background-color,border-color,color,scale] duration-200 active:scale-[0.97]"
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

/* ── Parameter Controls ────────────────────────────── */

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full min-h-[40px] py-2 cursor-pointer select-none"
    >
      <span className="text-[13px] text-[var(--page-text-muted)]">{label}</span>
      <div
        className="relative w-9 h-[22px] rounded-full transition-colors duration-200 shrink-0"
        style={{ backgroundColor: checked ? "var(--on-surface-muted)" : "var(--outline)" }}
      >
        <div
          className="absolute top-[3px] h-4 w-4 rounded-full transition-[transform,background-color] duration-200"
          style={{
            backgroundColor: checked ? "var(--page-text)" : "var(--page-text-muted)",
            transform: checked ? "translateX(17px)" : "translateX(3px)",
          }}
        />
      </div>
    </button>
  );
}

function SegmentedControl({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const activeIndex = options.indexOf(value);

  return (
    <div className="flex items-center justify-between w-full py-2.5 select-none">
      <span className="text-[13px] text-[var(--page-text-muted)]">{label}</span>
      <div className="relative flex rounded-lg border border-[var(--outline)]">
        {/* Sliding indicator */}
        <div
          className="absolute inset-y-0 rounded-[7px]"
          style={{
            backgroundColor: "var(--on-surface-muted)",
            width: `${100 / options.length}%`,
            left: `${(activeIndex * 100) / options.length}%`,
            transition: "left 250ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="relative z-[1] w-[52px] text-center py-1 text-[12px] font-medium cursor-pointer outline-none"
            style={{
              color: value === opt ? "var(--page)" : "var(--page-text-muted)",
              transition: "color 200ms ease-out",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, inputStep }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; inputStep: number }) {
  return (
    <div className="flex items-center justify-between w-full py-2.5 select-none">
      <span className="text-[13px] text-[var(--page-text-muted)]">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v) && v >= min && v <= max) onChange(v);
        }}
        min={min}
        max={max}
        step={inputStep}
        className="w-16 rounded-lg border border-[var(--outline)] bg-transparent px-2 py-1 text-right text-[13px] font-mono text-[var(--page-text)] tabular-nums outline-none focus:border-[var(--on-surface-muted)] transition-colors duration-150"
      />
    </div>
  );
}

/* ── Copy Button ───────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="relative text-[12px] cursor-pointer shrink-0 outline-none overflow-hidden"
      style={{ height: "18px", minWidth: "42px" }}
    >
      {/* "Copy" text */}
      <span
        className="absolute inset-0 flex items-center justify-end"
        style={{
          color: "var(--page-text-muted)",
          opacity: copied ? 0 : 1,
          transform: copied ? "translateY(-8px)" : "translateY(0)",
          filter: copied ? "blur(3px)" : "blur(0px)",
          transition: copied
            ? "opacity 150ms ease-in, transform 150ms ease-in, filter 150ms ease-in"
            : "opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1), filter 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        Copy
      </span>
      {/* "Copied" text */}
      <span
        className="absolute inset-0 flex items-center justify-end"
        style={{
          color: "#6bcf7f",
          opacity: copied ? 1 : 0,
          transform: copied ? "translateY(0)" : "translateY(8px)",
          filter: copied ? "blur(0px)" : "blur(3px)",
          transition: copied
            ? "opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1), filter 250ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "opacity 150ms ease-in, transform 150ms ease-in, filter 150ms ease-in",
        }}
      >
        Copied
      </span>
    </button>
  );
}

/* ── Code Block ────────────────────────────────────── */

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-2xl border border-[var(--outline)] overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--outline)]">
          <span className="text-[12px] font-medium text-[var(--page-text-muted)] opacity-60">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="px-5 py-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-[var(--page-text)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── Install Block with package manager tabs ───────── */

const PKG_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
const DEPS = "@radix-ui/react-slider @number-flow/react web-haptics clsx tailwind-merge";

const INSTALL_COMMANDS: Record<(typeof PKG_MANAGERS)[number], string> = {
  npm: `npm i ${DEPS}`,
  pnpm: `pnpm add ${DEPS}`,
  yarn: `yarn add ${DEPS}`,
  bun: `bun add ${DEPS}`,
};

function InstallBlock() {
  const [pm, setPm] = useState<(typeof PKG_MANAGERS)[number]>("npm");
  const [displayedPm, setDisplayedPm] = useState(pm);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (pm === displayedPm) return;
    setTransitioning(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayedPm(pm);
      setTransitioning(false);
    }, 150);
  }, [pm, displayedPm]);


  return (
    <div>
      <div className="flex items-center gap-4 mb-4 select-none">
        {PKG_MANAGERS.map((p) => (
          <button
            key={p}
            onClick={() => setPm(p)}
            className="text-[14px] cursor-pointer transition-colors duration-150 outline-none"
            style={{
              color: pm === p ? "var(--page-text)" : "var(--page-text-muted)",
              fontWeight: pm === p ? 600 : 400,
              opacity: pm === p ? 1 : 0.5,
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-[var(--outline)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <pre className="text-[13px] font-mono text-[var(--page-text)] overflow-x-auto">
            <code>
              <span className="text-[var(--page-text-muted)]">$ </span>
              <span
                style={{
                  display: "inline-block",
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning ? "translateY(4px)" : "translateY(0)",
                  filter: transitioning ? "blur(2px)" : "blur(0px)",
                  transition: transitioning
                    ? "opacity 100ms ease-in, transform 100ms ease-in, filter 100ms ease-in"
                    : "opacity 200ms ease-out, transform 200ms ease-out, filter 200ms ease-out",
                }}
              >
                {INSTALL_COMMANDS[displayedPm]}
              </span>
            </code>
          </pre>
          <CopyButton text={INSTALL_COMMANDS[pm]} />
        </div>
      </div>
    </div>
  );
}

/* ── Usage Block with framework tabs ───────────────── */

const FRAMEWORKS = ["React", "TypeScript", "Vue", "Svelte"] as const;

function UsageBlock({ enableSound, enableHaptics, chipPosition, sliderMin, sliderMax, sliderStep }: {
  enableSound: boolean; enableHaptics: boolean; chipPosition: string; sliderMin: number; sliderMax: number; sliderStep: number;
}) {
  const [fw, setFw] = useState<(typeof FRAMEWORKS)[number]>("React");
  const [displayedFw, setDisplayedFw] = useState(fw);
  const [fwTransitioning, setFwTransitioning] = useState(false);
  const fwTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const usageBoxRef = useRef<HTMLDivElement>(null);
  const usageContentRef = useRef<HTMLDivElement>(null);
  const [usageHeight, setUsageHeight] = useState<number | undefined>(undefined);

  // Measure and animate height on framework change
  useEffect(() => {
    if (fw === displayedFw) return;
    // Lock current height before content swap
    if (usageBoxRef.current) {
      setUsageHeight(usageBoxRef.current.getBoundingClientRect().height);
    }
    setFwTransitioning(true);
    clearTimeout(fwTimeoutRef.current);
    fwTimeoutRef.current = setTimeout(() => {
      setDisplayedFw(fw);
      setFwTransitioning(false);
      // Measure new content height after swap
      requestAnimationFrame(() => {
        if (usageContentRef.current) {
          setUsageHeight(usageContentRef.current.getBoundingClientRect().height);
        }
      });
    }, 150);
  }, [fw, displayedFw]);

  const optionalProps = [
    !enableSound ? "  enableSound={false}" : "",
    !enableHaptics ? "  enableHaptics={false}" : "",
    chipPosition !== "top" ? `  chipPosition="${chipPosition}"` : "",
  ].filter(Boolean).join("\n");

  const snippets: Record<(typeof FRAMEWORKS)[number], string> = {
    React: `import { Slider } from "@/components/ui/slider";

<Slider
  label="Frequency"
  value={frequency}
  onValueChange={setFrequency}
  min={${sliderMin}}
  max={${sliderMax}}
  step={${sliderStep}}${optionalProps ? "\n" + optionalProps : ""}
/>`,
    TypeScript: `import { Slider } from "@/components/ui/slider";

const [frequency, setFrequency] = useState<number>(0.65);

<Slider
  label="Frequency"
  value={frequency}
  onValueChange={(v: number) => setFrequency(v)}
  min={${sliderMin}}
  max={${sliderMax}}
  step={${sliderStep}}${optionalProps ? "\n" + optionalProps : ""}
/>`,
    Vue: `<template>
  <Slider
    label="Frequency"
    :value="frequency"
    @update:value="frequency = $event"
    :min="${sliderMin}"
    :max="${sliderMax}"
    :step="${sliderStep}"${!enableSound ? '\n    :enable-sound="false"' : ""}${!enableHaptics ? '\n    :enable-haptics="false"' : ""}${chipPosition !== "top" ? `\n    chip-position="${chipPosition}"` : ""}
  />
</template>

<script setup>
import { ref } from "vue";
const frequency = ref(0.65);
</script>`,
    Svelte: `<script>
  import Slider from "./Slider.svelte";
  let frequency = 0.65;
</script>

<Slider
  label="Frequency"
  value={frequency}
  on:change={(e) => frequency = e.detail}
  min={${sliderMin}}
  max={${sliderMax}}
  step={${sliderStep}}${!enableSound ? "\n  enableSound={false}" : ""}${!enableHaptics ? "\n  enableHaptics={false}" : ""}${chipPosition !== "top" ? `\n  chipPosition="${chipPosition}"` : ""}
/>`,
  };

  const icons: Record<string, React.ReactNode> = {
    React: (
      <svg width="18" height="18" viewBox="-11.5 -10.23 23 20.46" fill="none">
        <circle r="2.05" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
    TypeScript: (
      <svg width="16" height="16" viewBox="0 0 512 512" fill="none">
        <rect width="512" height="512" rx="50" fill="currentColor" opacity="0.15" />
        <path d="M317 407v50c8 4 18 7 29 9s22 3 34 3c11 0 22-1 33-4s20-7 28-13 15-14 20-24 7-22 7-36c0-10-2-19-5-27s-7-15-13-21-12-11-20-16-16-9-25-13c-6-3-12-6-17-8s-9-5-12-8-6-6-7-9-2-7-2-11c0-4 1-7 3-10s4-6 7-8 7-4 11-5 9-2 14-2c4 0 8 0 12 1s9 2 13 4 8 4 11 7 6 6 9 10l26-17 13-18c-5-6-11-11-18-15s-14-7-22-9-16-3-24-3c-11 0-22 1-32 4s-19 7-27 13-14 14-19 23-7 21-7 34c0 16 5 29 14 40s23 19 42 27c6 3 12 5 18 8s10 5 14 8 7 6 9 10 3 7 3 12c0 4-1 8-3 11s-5 6-8 8-8 4-13 5-10 2-15 2c-11 0-21-3-30-8s-17-13-23-23zM233 284h66v-37H118v37h66v174h49z" fill="currentColor" />
      </svg>
    ),
    Vue: (
      <svg width="16" height="16" viewBox="0 0 261.76 226.69" fill="none">
        <path d="M161.096.001l-30.224 52.35L100.647.001H0L130.872 226.688 261.76.001z" fill="currentColor" opacity="0.3" />
        <path d="M161.096.001l-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z" fill="currentColor" />
      </svg>
    ),
    Svelte: (
      <svg width="14" height="16" viewBox="0 0 98.1 118" fill="none">
        <path d="M91.8 15.6C80.9-.5 59.2-4.7 43.7 5.1L16.5 22.3A31 31 0 0 0 2.4 39.1a32.5 32.5 0 0 0 3.4 24.9 31 31 0 0 0-4.7 11.7 32.8 32.8 0 0 0 5.6 24.8c10.9 16.1 32.6 20.3 48.1 10.5l27.2-17.2a31 31 0 0 0 14.1-16.8 32.5 32.5 0 0 0-3.4-24.9 31 31 0 0 0 4.7-11.7 32.8 32.8 0 0 0-5.6-24.8z" fill="currentColor" opacity="0.3" />
        <path d="M40.9 103.9a21 21 0 0 1-22.6-8.4 19.4 19.4 0 0 1-3.3-14.7l.5-2.3 1.5 1a35 35 0 0 0 10.7 5.4l1 .3-.1 1a5.8 5.8 0 0 0 1.1 4.5 6.3 6.3 0 0 0 6.7 2.5 5.8 5.8 0 0 0 1.6-.7L65.2 75.4a5.4 5.4 0 0 0 2.4-3.7 5.8 5.8 0 0 0-1-4.4 6.3 6.3 0 0 0-6.7-2.5 5.8 5.8 0 0 0-1.6.7l-10.4 6.6a19.4 19.4 0 0 1-5.3 2.3 21 21 0 0 1-22.6-8.4 19.4 19.4 0 0 1-3.3-14.7 18 18 0 0 1 8.1-12.4L52 21.7a19.4 19.4 0 0 1 5.3-2.3A21 21 0 0 1 79.9 28a19.4 19.4 0 0 1 3.3 14.7l-.5 2.3-1.5-1a35 35 0 0 0-10.7-5.4l-1-.3.1-1a5.8 5.8 0 0 0-1.1-4.5 6.3 6.3 0 0 0-6.7-2.5 5.8 5.8 0 0 0-1.6.7L33 48.2a5.4 5.4 0 0 0-2.5 3.7 5.8 5.8 0 0 0 1 4.4 6.3 6.3 0 0 0 6.7 2.5 5.8 5.8 0 0 0 1.6-.7l10.4-6.6a19.4 19.4 0 0 1 5.3-2.3 21 21 0 0 1 22.6 8.4 19.4 19.4 0 0 1 3.3 14.7 18 18 0 0 1-8.1 12.4l-27.2 17.2a19.4 19.4 0 0 1-5.2 2.3z" fill="currentColor" />
      </svg>
    ),
  };

  return (
    <div>
      <div className="flex items-center gap-5 mb-4 select-none">
        {FRAMEWORKS.map((f) => (
          <button
            key={f}
            onClick={() => setFw(f)}
            className="inline-flex items-center gap-1.5 text-[14px] cursor-pointer transition-colors duration-150 outline-none"
            style={{
              color: fw === f ? "var(--page-text)" : "var(--page-text-muted)",
              fontWeight: fw === f ? 600 : 400,
              opacity: fw === f ? 1 : 0.4,
            }}
          >
            {icons[f]}
            {f}
          </button>
        ))}
      </div>
      <div
        className="rounded-2xl border border-[var(--outline)] overflow-hidden"
        style={{ transition: "height 300ms cubic-bezier(0.16, 1, 0.3, 1)", height: usageHeight ?? "auto" }}
        ref={usageBoxRef}
      >
        <div className="flex items-start justify-between px-5 py-4" ref={usageContentRef}>
          <pre className="text-[13px] font-mono leading-relaxed text-[var(--page-text)] overflow-x-auto flex-1">
            <code>
              <span
                style={{
                  display: "inline-block",
                  opacity: fwTransitioning ? 0 : 1,
                  transform: fwTransitioning ? "translateY(4px)" : "translateY(0)",
                  filter: fwTransitioning ? "blur(2px)" : "blur(0px)",
                  transition: fwTransitioning
                    ? "opacity 100ms ease-in, transform 100ms ease-in, filter 100ms ease-in"
                    : "opacity 200ms ease-out, transform 200ms ease-out, filter 200ms ease-out",
                }}
              >
                {snippets[displayedFw]}
              </span>
            </code>
          </pre>
          <div className="shrink-0 ml-4 mt-0.5">
            <CopyButton text={snippets[displayedFw]} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Props Table ───────────────────────────────────── */

const PROPS_CATEGORIES: { category: string; props: { prop: string; type: string; default: string; desc: string; required: boolean }[] }[] = [
  {
    category: "Core",
    props: [
      { prop: "value", type: "number", default: "\u2014", desc: "Current value", required: true },
      { prop: "onValueChange", type: "(v: number) => void", default: "\u2014", desc: "Change handler", required: true },
      { prop: "min", type: "number", default: "\u2014", desc: "Minimum value", required: true },
      { prop: "max", type: "number", default: "\u2014", desc: "Maximum value", required: true },
      { prop: "step", type: "number", default: "\u2014", desc: "Step increment", required: true },
    ],
  },
  {
    category: "Display",
    props: [
      { prop: "label", type: "string", default: "\u2014", desc: "Label text", required: true },
      { prop: "unit", type: "string", default: "\u2014", desc: 'Unit suffix (e.g. "%")', required: false },
      { prop: "chipPosition", type: '"top" | "bottom"', default: '"top"', desc: "Hover chip position", required: false },
    ],
  },
  {
    category: "Feedback",
    props: [
      { prop: "enableSound", type: "boolean", default: "true", desc: "Scrub sounds", required: false },
      { prop: "enableHaptics", type: "boolean", default: "true", desc: "Haptic feedback", required: false },
    ],
  },
];

const CODE_CELL_CLASS = "rounded-md bg-[var(--outline)] px-1.5 py-0.5 font-mono text-[12px]";

function PropsTable() {
  // Flatten for mobile
  const allProps = PROPS_CATEGORIES.flatMap((cat) =>
    cat.props.map((p) => ({ ...p, category: cat.category }))
  );

  return (
    <>
      {/* Desktop table (sm and above) */}
      <div className="hidden sm:block rounded-2xl border border-[var(--outline)] overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[var(--outline)]">
              <th className="px-5 py-3 text-[12px] font-medium text-[var(--page-text-muted)] opacity-60">Prop</th>
              <th className="px-5 py-3 text-[12px] font-medium text-[var(--page-text-muted)] opacity-60">Type</th>
              <th className="px-5 py-3 text-[12px] font-medium text-[var(--page-text-muted)] opacity-60">Default</th>
              <th className="px-5 py-3 text-[12px] font-medium text-[var(--page-text-muted)] opacity-60">Description</th>
            </tr>
          </thead>
          <tbody>
            {PROPS_CATEGORIES.map((cat, catIdx) => {
              const rows: React.ReactNode[] = [];
              // Category subheader
              rows.push(
                <tr key={`cat-${cat.category}`} className="border-b border-[var(--outline)]">
                  <td
                    colSpan={4}
                    className="px-5 py-2 text-[11px] font-medium tracking-wider uppercase text-[var(--page-text-muted)] opacity-40"
                  >
                    {cat.category}
                  </td>
                </tr>
              );
              // Props rows
              cat.props.forEach((row, i) => {
                const isLast = catIdx === PROPS_CATEGORIES.length - 1 && i === cat.props.length - 1;
                rows.push(
                  <tr key={row.prop} className={!isLast ? "border-b border-[var(--outline)]" : ""}>
                    <td className="px-5 py-3 font-mono text-[12px] text-[var(--page-text)]">
                      {row.prop}
                      {row.required && (
                        <span className="text-[var(--page-text-muted)] opacity-40 ml-1">*</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[var(--page-text-muted)]">
                      <code className={CODE_CELL_CLASS}>{row.type}</code>
                    </td>
                    <td className="px-5 py-3 text-[var(--page-text-muted)]">
                      <code className={CODE_CELL_CLASS}>{row.default}</code>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[var(--page-text-muted)]">{row.desc}</td>
                  </tr>
                );
              });
              return rows;
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards (below sm) */}
      <div className="sm:hidden space-y-3">
        {PROPS_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--page-text-muted)] opacity-40 mb-2 px-1">
              {cat.category}
            </div>
            <div className="space-y-2">
              {cat.props.map((row) => (
                <div
                  key={row.prop}
                  className="rounded-2xl border border-[var(--outline)] px-4 py-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] font-medium text-[var(--page-text)]">
                      {row.prop}
                      {row.required && (
                        <span className="text-[var(--page-text-muted)] opacity-40 ml-1">*</span>
                      )}
                    </span>
                    <code className={CODE_CELL_CLASS}>{row.default}</code>
                  </div>
                  <div>
                    <code className={CODE_CELL_CLASS}>{row.type}</code>
                  </div>
                  <p className="text-[12px] text-[var(--page-text-muted)]">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Anchor Links ──────────────────────────────────── */

const SECTIONS = [
  { id: "install", label: "Install" },
  { id: "usage", label: "Usage" },
  { id: "playground", label: "Playground" },
  { id: "props", label: "Props" },
  { id: "tokens", label: "Tokens" },
] as const;

function AnchorNav() {
  return (
    <nav className="flex items-center gap-4 select-none">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="text-[14px] transition-colors duration-150 outline-none"
          style={{
            color: "var(--page-text-muted)",
            opacity: 0.5,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--page-text)";
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--page-text-muted)";
            (e.currentTarget as HTMLElement).style.opacity = "0.5";
          }}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}

/* ── Page ──────────────────────────────────────────── */

export default function Page() {
  const [frequency, setFrequency] = useState(0.65);
  const [playgroundFrequency, setPlaygroundFrequency] = useState(0.65);
  const [enableSound, setEnableSound] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [chipPosition, setChipPosition] = useState<"top" | "bottom">("top");
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(1);
  const [sliderStep, setSliderStep] = useState(0.01);

  return (
    <div className="min-h-screen bg-[var(--page)]">
      {/* Single narrow column */}
      <div className="mx-auto max-w-[620px] px-6">

        {/* Nav */}
        <nav className="flex items-center justify-between py-5">
          <span
            className="text-[var(--page-text)] select-none"
            style={{ fontFamily: "'Reenie Beanie', cursive", fontSize: "28px", lineHeight: 1 }}
          >
            scrub slider
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/sethihq/scrub-slider"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-full border border-[var(--toolbar-border)] bg-[var(--surface)] text-[var(--page-text)] transition-[background-color,border-color,color,scale] duration-200 hover:bg-[var(--outline)] active:scale-[0.97] cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero -- slider with default props, no params visible */}
        <section className="relative pt-16 pb-12">
          <p className="text-[15px] text-[var(--page-text-muted)] text-center mb-12 text-pretty select-none">
            A slider with scrub sounds and haptic feedback
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-[320px]">
              <Slider
                label="Frequency"
                value={frequency}
                onValueChange={setFrequency}
                min={0}
                max={1}
                step={0.01}
                enableSound={true}
                enableHaptics={true}
                chipPosition="top"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-10">
          <ul className="space-y-1.5 text-[13px] text-[var(--page-text-muted)]">
            <li className="flex items-start gap-2">
              <span className="mt-[7px] block h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--page-text-muted)] opacity-40" />
              Scrub sounds via Web Audio API
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[7px] block h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--page-text-muted)] opacity-40" />
              Haptic feedback via web-haptics
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[7px] block h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--page-text-muted)] opacity-40" />
              Animated value display with NumberFlow
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[7px] block h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--page-text-muted)] opacity-40" />
              Fully themeable with CSS custom properties
            </li>
          </ul>
        </section>

        {/* Anchor links */}
        <div className="pb-12">
          <AnchorNav />
        </div>

        {/* Install */}
        <section id="install" className="pb-16 scroll-mt-8">
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none">Install</h2>
          <InstallBlock />
          <p className="mt-4 text-[13px] text-[var(--page-text-muted)] leading-relaxed">
            Then copy <code className="font-mono text-[var(--page-text)]">slider.tsx</code>, <code className="font-mono text-[var(--page-text)]">use-sound.ts</code>, and <code className="font-mono text-[var(--page-text)]">use-haptics.ts</code> into your project.
          </p>
        </section>

        {/* Usage */}
        <section id="usage" className="pb-16 scroll-mt-8">
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none">Usage</h2>
          <UsageBlock
            enableSound={enableSound}
            enableHaptics={enableHaptics}
            chipPosition={chipPosition}
            sliderMin={sliderMin}
            sliderMax={sliderMax}
            sliderStep={sliderStep}
          />
          <p className="mt-4 text-[13px] text-[var(--page-text-muted)] leading-relaxed">
            Updates live as you change parameters in the playground below.
          </p>
        </section>

        {/* Playground -- slider + params inline */}
        <section id="playground" className="pb-16 scroll-mt-8">
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none">Playground</h2>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Slider */}
            <div className="w-full sm:flex-1 flex justify-center pt-4">
              <div className="w-full max-w-[320px]">
                <Slider
                  label="Frequency"
                  value={Math.min(Math.max(playgroundFrequency, sliderMin), sliderMax)}
                  onValueChange={setPlaygroundFrequency}
                  min={sliderMin}
                  max={sliderMax}
                  step={sliderStep}
                  enableSound={enableSound}
                  enableHaptics={enableHaptics}
                  chipPosition={chipPosition}
                />
              </div>
            </div>
            {/* Params */}
            <div className="w-full sm:w-[220px] sm:shrink-0">
              <h3 className="text-[12px] font-medium tracking-wider uppercase text-[var(--page-text-muted)] opacity-50 mb-3">Parameters</h3>
              <div className="rounded-2xl border border-[var(--outline)] px-4 divide-y divide-[var(--outline)]">
                <Toggle label="Sound" checked={enableSound} onChange={setEnableSound} />
                <Toggle label="Haptics" checked={enableHaptics} onChange={setEnableHaptics} />
                <SegmentedControl label="Chip" options={["top", "bottom"]} value={chipPosition} onChange={(v) => setChipPosition(v as "top" | "bottom")} />
                <NumberInput label="Min" value={sliderMin} onChange={setSliderMin} min={-1000} max={sliderMax - sliderStep} inputStep={0.1} />
                <NumberInput label="Max" value={sliderMax} onChange={setSliderMax} min={sliderMin + sliderStep} max={10000} inputStep={0.1} />
                <NumberInput label="Step" value={sliderStep} onChange={setSliderStep} min={0.001} max={sliderMax - sliderMin} inputStep={0.001} />
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section id="props" className="pb-16 scroll-mt-8">
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none">Props</h2>
          <PropsTable />
        </section>

        {/* CSS Tokens */}
        <section id="tokens" className="pb-16 scroll-mt-8">
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none">CSS Tokens</h2>
          <CodeBlock
            label="Custom Properties"
            code={`:root {
  --surface: #ffffff;       /* Track background */
  --on-surface: #0a0a0a;   /* Thumb indicator */
  --on-surface-muted: #737373; /* Label, fills */
  --outline: #e5e5e5;      /* Track border */
  --chip: #a3a3a3;         /* Hover chip bg */
  --on-chip: #fafafa;      /* Hover chip text */
}`}
          />
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-3 pb-10 text-[13px] text-[var(--page-text-muted)]">
          <span>
            Built with <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="text-[var(--page-text)] hover:underline">Claude Code</a>
            {" \u00B7 "}
            Tuned with <a href="https://x.com/joshpuckett/status/2024141004685656447" target="_blank" rel="noopener noreferrer" className="text-[var(--page-text)] hover:underline">DialKit</a>
          </span>
          <MadeWithLove />
        </footer>

      </div>
    </div>
  );
}
