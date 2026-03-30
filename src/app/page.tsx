"use client";

import { useState, useRef, useEffect } from "react";
import { Calligraph } from "calligraph";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/hooks/use-theme";
import { MadeWithLove } from "@/components/made-with-love";

/* ── Constants ────────────────────────────────────── */

const SUCCESS_COLOR = "var(--success)";
const STAGGER_BASE = 60; // ms between section entrance animations

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
        style={{ backgroundColor: checked ? "color-mix(in srgb, var(--on-surface-muted) 50%, transparent)" : "var(--outline)" }}
      >
        <div
          className="absolute top-[3px] h-4 w-4 rounded-full transition-[transform,background-color] duration-200"
          style={{
            backgroundColor: checked ? "var(--page-text-muted)" : "color-mix(in srgb, var(--page-text-muted) 50%, transparent)",
            transform: checked ? "translateX(17px)" : "translateX(3px)",
          }}
        />
      </div>
    </button>
  );
}

function SegmentedControl({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const activeIndex = options.indexOf(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const btns = container.querySelectorAll<HTMLButtonElement>("button");
    const btn = btns[activeIndex];
    if (btn) {
      setPillStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [activeIndex]);

  return (
    <div className="flex items-center justify-between w-full py-2.5 select-none">
      <span className="text-[13px] text-[var(--page-text-muted)]">{label}</span>
      <div ref={containerRef} className="relative flex rounded-full p-0.5" style={{ backgroundColor: "var(--outline)" }}>
        {pillStyle && (
          <div
            className="absolute top-0.5 bottom-0.5 rounded-full"
            style={{
              backgroundColor: "color-mix(in srgb, var(--on-surface-muted) 60%, transparent)",
              width: pillStyle.width,
              left: pillStyle.left,
              transition: "left 250ms cubic-bezier(0.16, 1, 0.3, 1), width 250ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        )}
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="relative z-[1] text-center px-6 py-0.5 text-[12px] font-medium cursor-pointer outline-none rounded-full"
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
        className="w-16 rounded-lg border border-[var(--outline)] bg-transparent px-2 py-1 text-right text-[13px] font-mono text-[var(--page-text)] tabular-nums outline-none focus:border-[var(--on-surface-muted)] transition-colors duration-150 select-text"
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
      className="text-[12px] cursor-pointer shrink-0 outline-none"
      style={{ color: copied ? SUCCESS_COLOR : "var(--page-text-muted)", transition: "color 250ms cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <Calligraph animation="smooth" drift={{ x: 6, y: 0 }} stagger={0.02}>
        {copied ? "Copied" : "Copy"}
      </Calligraph>
    </button>
  );
}

/* ── Draggable Panel ───────────────────────────────── */

function DraggablePanel({ children }: { children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, input, a")) return;
    dragState.current = {
      dragging: true,
      startX: e.clientX - pos.x,
      startY: e.clientY - pos.y,
      offsetX: pos.x,
      offsetY: pos.y,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    setPos({
      x: e.clientX - dragState.current.startX,
      y: e.clientY - dragState.current.startY,
    });
  };

  const onPointerUp = () => {
    dragState.current.dragging = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={panelRef}
      className="relative w-full max-w-[320px] lg:w-[220px] lg:shrink-0 select-none"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: isDragging ? "none" : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 50 : 1,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Six-dot drag handle */}
      <div
        className="absolute -left-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-[3px] transition-opacity duration-200"
        style={{ opacity: isDragging ? 0.6 : 0.25 }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-[3px]">
            <div className="w-[4px] h-[4px] rounded-full" style={{ backgroundColor: "var(--on-surface-muted)" }} />
            <div className="w-[4px] h-[4px] rounded-full" style={{ backgroundColor: "var(--on-surface-muted)" }} />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

/* ── Code Block ────────────────────────────────────── */

/* Neutral syntax highlighting — no colors, just weight and opacity */
function highlightCode(code: string) {
  return code.split("\n").map((line, i) => {
    // Comments
    if (line.trimStart().startsWith("/*") || line.trimStart().startsWith("*") || line.trimStart().startsWith("//")) {
      return <div key={i} style={{ opacity: 0.35 }}>{line}</div>;
    }
    // CSS property lines (key: value;)
    const cssMatch = line.match(/^(\s*)(--[\w-]+|[\w-]+)(:)(.+)(;?)$/);
    if (cssMatch) {
      return (
        <div key={i}>
          {cssMatch[1]}
          <span style={{ opacity: 0.6 }}>{cssMatch[2]}</span>
          <span style={{ opacity: 0.3 }}>{cssMatch[3]}</span>
          <span>{cssMatch[4]}</span>
          <span style={{ opacity: 0.3 }}>{cssMatch[5]}</span>
        </div>
      );
    }
    return <div key={i}>{line || "\u00A0"}</div>;
  });
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-2xl border border-[var(--outline)] overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--outline)]">
          <span className="text-[12px] font-medium text-[var(--page-text-muted)] opacity-60">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="px-5 py-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-[var(--page-text)] select-text">
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}

/* ── Install Block with package manager tabs ───────── */

const PKG_MANAGERS = ["npm", "pnpm", "yarn", "bun", "skill"] as const;
const PKG = "@sethihq/scrub-slider";

const INSTALL_PREFIXES: Record<(typeof PKG_MANAGERS)[number], string> = {
  npm: "npm i",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
  skill: "npx skills add",
};

function InstallBlock() {
  const [pm, setPm] = useState<(typeof PKG_MANAGERS)[number]>("npm");
  const displayPkg = pm === "skill" ? "sethihq/scrub-slider" : PKG;
  const fullCommand = `${INSTALL_PREFIXES[pm]} ${displayPkg}`;

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-4 mb-4 select-none">
        {PKG_MANAGERS.map((p) => (
          <button
            key={p}
            onClick={() => setPm(p)}
            className="text-[14px] min-h-[40px] cursor-pointer transition-[color,opacity,transform] duration-150 outline-none hover:opacity-70 active:scale-[0.96]"
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
          <pre className="text-[13px] font-mono text-[var(--page-text)] overflow-x-auto select-text">
            <code>
              <span className="text-[var(--page-text-muted)]">$ </span>
              <Calligraph animation="smooth" drift={{ x: 8, y: 0 }} stagger={0.03}>
                {INSTALL_PREFIXES[pm]}
              </Calligraph>
              <span> {displayPkg}</span>
            </code>
          </pre>
          <CopyButton text={fullCommand} />
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
      // Measure new content height after swap, then reset to auto
      requestAnimationFrame(() => {
        if (usageContentRef.current) {
          const newHeight = usageContentRef.current.getBoundingClientRect().height;
          setUsageHeight(newHeight);
          // Reset to auto after transition so future measurements are accurate
          setTimeout(() => setUsageHeight(undefined), 350);
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
      <div className="flex items-center gap-3 sm:gap-5 mb-4 select-none">
        {FRAMEWORKS.map((f) => (
          <button
            key={f}
            onClick={() => setFw(f)}
            className="inline-flex items-center gap-1.5 text-[14px] min-h-[40px] cursor-pointer transition-[color,opacity,transform] duration-150 outline-none hover:opacity-70 active:scale-[0.96]"
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
          <pre className="text-[13px] font-mono leading-relaxed text-[var(--page-text)] overflow-x-auto flex-1 select-text">
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

const CODE_CELL_CLASS = "rounded-md bg-[color-mix(in_srgb,var(--on-surface-muted)_15%,transparent)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--page-text-muted)]";

function PropsTable() {
  const [activeCat, setActiveCat] = useState(PROPS_CATEGORIES[0].category);
  const [displayedCat, setDisplayedCat] = useState(activeCat);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const handleCatChange = (cat: string) => {
    if (cat === activeCat) return;
    const oldIdx = PROPS_CATEGORIES.findIndex((c) => c.category === activeCat);
    const newIdx = PROPS_CATEGORIES.findIndex((c) => c.category === cat);
    setDirection(newIdx > oldIdx ? 1 : -1);
    setActiveCat(cat);
    setPhase("out");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayedCat(cat);
      setPhase("in");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("idle"));
      });
    }, 140);
  };

  const activeProps = PROPS_CATEGORIES.find((c) => c.category === displayedCat)?.props ?? [];
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

  const contentStyle: React.CSSProperties =
    phase === "out"
      ? { opacity: 0, transform: `translateX(${-direction * 8}px) scale(0.98)`, filter: "blur(6px)", transition: `opacity 150ms ease-in, transform 150ms ease-in, filter 150ms ease-in` }
      : phase === "in"
        ? { opacity: 0, transform: `translateX(${direction * 8}px) scale(0.98)`, filter: "blur(6px)", transition: "none" }
        : { opacity: 1, transform: "translateX(0) scale(1)", filter: "blur(0px)", transition: `opacity 280ms ${ease}, transform 320ms ${ease}, filter 250ms ${ease}` };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 select-none">
        {PROPS_CATEGORIES.map((cat) => (
          <button
            key={cat.category}
            onClick={() => handleCatChange(cat.category)}
            className="text-[14px] min-h-[40px] cursor-pointer transition-[color,opacity,transform] duration-150 outline-none hover:opacity-70 active:scale-[0.96]"
            style={{
              color: activeCat === cat.category ? "var(--page-text)" : "var(--page-text-muted)",
              fontWeight: activeCat === cat.category ? 600 : 400,
              opacity: activeCat === cat.category ? 1 : 0.5,
            }}
          >
            {cat.category}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-[var(--outline)] overflow-hidden">
        <div style={contentStyle}>
          {activeProps.map((row, i) => (
            <div
              key={row.prop}
              className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 px-4 py-2.5 select-text ${i < activeProps.length - 1 ? "border-b border-[var(--outline)]" : ""}`}
            >
              <span className="font-mono text-[12px] font-medium text-[var(--page-text)] shrink-0 sm:w-[120px]">
                {row.prop}
                {row.required && <span className="text-[var(--page-text-muted)] opacity-40 ml-0.5">*</span>}
              </span>
              <div className="flex items-center gap-2 sm:contents">
                <code className={`${CODE_CELL_CLASS} shrink-0`}>{row.type}</code>
                <span className="text-[12px] text-[var(--page-text-muted)] sm:ml-auto shrink-0">{row.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Surface Nav (Top → Bottom morph) ─────────────── */

const NAV_SURFACE = "border border-[color-mix(in_srgb,var(--outline)_50%,transparent)] bg-[var(--surface)] backdrop-blur-xl";
const NAV_SHADOW = "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px var(--outline)";

const SECTIONS = [
  { id: "install", label: "Install" },
  { id: "usage", label: "Usage" },
  { id: "props", label: "Props" },
  { id: "tokens", label: "Tokens" },
] as const;

function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function SurfaceNav() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [navVisible, setNavVisible] = useState(false);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const { resolvedTheme, setTheme } = useTheme();

  // Show nav after scrolling past hero
  useEffect(() => {
    const onScroll = () => setNavVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll handler
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Update sliding pill position when active section changes
  useEffect(() => {
    const link = linkRefs.current[activeSection];
    if (!link) { setPillStyle(null); return; }
    const parent = link.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setPillStyle({
      left: linkRect.left - parentRect.left,
      width: linkRect.width,
    });
  }, [activeSection]);

  // Track active section
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const themeButton = (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`flex size-8 items-center justify-center rounded-full text-[var(--page-text)] cursor-pointer transition-[background-color,transform] duration-200 hover:bg-[color-mix(in_srgb,var(--on-surface-muted)_12%,transparent)] active:scale-[0.96]`}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="absolute"
        style={{
          opacity: resolvedTheme === "dark" ? 1 : 0,
          transform: resolvedTheme === "dark" ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)",
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
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="absolute"
        style={{
          opacity: resolvedTheme === "light" ? 1 : 0,
          transform: resolvedTheme === "light" ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(90deg)",
          filter: resolvedTheme === "light" ? "blur(0px)" : "blur(4px)",
          transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );

  const githubLink = (
    <a
      href="https://github.com/sethihq/scrub-slider"
      target="_blank"
      rel="noopener noreferrer"
      className="flex size-8 items-center justify-center rounded-full text-[var(--page-text)] transition-[background-color,transform] duration-200 hover:bg-[color-mix(in_srgb,var(--on-surface-muted)_12%,transparent)] active:scale-[0.96] cursor-pointer"
    >
      <GitHubIcon size={14} />
    </a>
  );

  return (
    <>
      {/* ─── Bottom Floating Nav — two pills ─── */}
      <div
        className="fixed bottom-5 left-0 right-0 z-50 flex justify-center select-none"
        style={{
          opacity: navVisible ? 1 : 0,
          transform: `translateY(${navVisible ? "0" : "100%"})`,
          filter: navVisible ? "blur(0px)" : "blur(6px)",
          transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: navVisible ? "auto" : "none",
        }}
      >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Left pill — section navigation */}
        <nav
          className={`flex items-center gap-0.5 rounded-full ${NAV_SURFACE} px-1 sm:px-1.5 py-1.5`}
          style={{ boxShadow: NAV_SHADOW }}
        >
          <div className="relative flex items-center gap-0.5">
            {pillStyle && (
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--on-surface-muted) 12%, transparent)",
                  left: pillStyle.left,
                  width: pillStyle.width,
                  top: 0,
                  bottom: 0,
                  transition: "left 300ms cubic-bezier(0.16, 1, 0.3, 1), width 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            )}
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                ref={(el) => { linkRefs.current[s.id] = el; }}
                href={`#${s.id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
                className="relative z-[1] rounded-full px-2 sm:px-3 py-1.5 text-[12px] sm:text-[13px] font-medium transition-[color,transform] duration-200 cursor-pointer outline-none border-none active:scale-[0.96]"
                style={{
                  color: activeSection === s.id ? "var(--page-text)" : "var(--page-text-muted)",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Right pill — logo + GitHub + theme */}
        <div
          className={`flex items-center gap-0.5 rounded-full ${NAV_SURFACE} px-1.5 py-1.5`}
          style={{ boxShadow: NAV_SHADOW }}
        >
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex size-8 items-center justify-center rounded-full text-[var(--page-text)] transition-[background-color] duration-200 hover:bg-[color-mix(in_srgb,var(--on-surface-muted)_12%,transparent)] outline-none border-none"
            style={{ fontFamily: "'Reenie Beanie', cursive", fontSize: "24px", lineHeight: 1 }}
          >
            ss
          </a>
          <div className="w-px h-4 bg-[var(--outline)] mx-0.5" />
          {githubLink}
          {themeButton}
        </div>
      </div>
      </div>
    </>
  );
}

/* ── Page ──────────────────────────────────────────── */

export default function Page() {
  const [frequency, setFrequency] = useState(0.65);
  const [enableSound, setEnableSound] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [chipPosition, setChipPosition] = useState<"top" | "bottom">("top");
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(1);
  const [sliderStep, setSliderStep] = useState(0.01);

  // Tab visibility — swap title when user leaves
  useEffect(() => {
    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? "👀 come back (pls)" : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const entranceStyle = (index: number): React.CSSProperties => ({
    opacity: 0,
    animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    animationDelay: `${index * STAGGER_BASE}ms`,
  });

  return (
    <div className="min-h-screen bg-[var(--page)] select-none">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); filter: blur(2px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>

      {/* Logo + tagline — top center */}
      <div className="pt-8 sm:pt-12 pb-4 text-center select-none" style={entranceStyle(0)}>
        <h1
          className="text-[var(--page-text)] text-wrap-balance"
          style={{ fontFamily: "'Reenie Beanie', cursive", fontSize: "36px", lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          <Calligraph animation="smooth" stagger={0.04} initial>
            scrub slider
          </Calligraph>
        </h1>
        <p className="text-[13px] text-[var(--page-text-muted)] mt-2 leading-relaxed">
          <Calligraph animation="smooth" stagger={0.02} initial>
            A slider with scrub sounds
          </Calligraph>
          <br />
          <Calligraph animation="smooth" stagger={0.02} initial>
            and haptic feedback.
          </Calligraph>
        </p>
      </div>

      {/* Single narrow column */}
      <div className="mx-auto max-w-[520px] px-6">

        <SurfaceNav />

        {/* Hero — interactive playground */}
        <section id="playground" className="relative pb-12 scroll-mt-8" style={entranceStyle(1)}>
          <div>
            <div className="w-full space-y-10">
              <Slider
                label="Frequency"
                value={Math.min(Math.max(frequency, sliderMin), sliderMax)}
                onValueChange={setFrequency}
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
                enableSound={enableSound}
                enableHaptics={enableHaptics}
                chipPosition={chipPosition}
              />
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

        {/* Install */}
        <section id="install" className="pb-16 scroll-mt-8" style={entranceStyle(2)}>
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none text-wrap-balance">Install</h2>
          <InstallBlock />
          <p className="mt-4 text-[13px] text-[var(--page-text-muted)] leading-relaxed text-wrap-pretty">
            Then copy <code className="font-mono text-[var(--page-text)]">slider.tsx</code>, <code className="font-mono text-[var(--page-text)]">use-sound.ts</code>, and <code className="font-mono text-[var(--page-text)]">use-haptics.ts</code> into your project.
          </p>
        </section>

        {/* Usage */}
        <section id="usage" className="pb-16 scroll-mt-8" style={entranceStyle(3)}>
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none text-wrap-balance">Usage</h2>
          <UsageBlock
            enableSound={enableSound}
            enableHaptics={enableHaptics}
            chipPosition={chipPosition}
            sliderMin={sliderMin}
            sliderMax={sliderMax}
            sliderStep={sliderStep}
          />
          <p className="mt-4 text-[13px] text-[var(--page-text-muted)] leading-relaxed text-wrap-pretty">
            Updates live as you change parameters above.
          </p>
        </section>

        {/* Props */}
        <section id="props" className="pb-16 scroll-mt-8" style={entranceStyle(4)}>
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none text-wrap-balance">Props</h2>
          <PropsTable />
        </section>

        {/* CSS Tokens */}
        <section id="tokens" className="pb-16 scroll-mt-8" style={entranceStyle(5)}>
          <h2 className="text-[15px] font-semibold text-[var(--page-text)] mb-4 select-none text-wrap-balance">CSS Tokens</h2>
          <CodeBlock
            label="Custom Properties"
            code={`:root {
  --surface: #ffffff;           /* Track background */
  --on-surface: #0a0a0a;        /* Thumb indicator  */
  --on-surface-muted: #737373;  /* Label, fills     */
  --outline: #e5e5e5;           /* Track border     */
  --chip: #a3a3a3;              /* Hover chip bg    */
  --on-chip: #fafafa;           /* Hover chip text  */
}`}
          />
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-3 pb-20 text-[13px] text-[var(--page-text-muted)]" style={entranceStyle(6)}>
          <MadeWithLove />
        </footer>

      </div>
    </div>
  );
}
