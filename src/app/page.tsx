"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

type CopyState = "idle" | "done" | "error";

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("error");
    }
    timeoutRef.current = setTimeout(() => setState("idle"), 1500);
  };

  const iconTransition = (active: boolean) =>
    active
      ? "opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out"
      : "opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out";

  const show = (visible: boolean) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.8)",
    filter: visible ? "blur(0px)" : "blur(2px)",
    transition: iconTransition(visible),
  });

  return (
    <button
      onClick={handleCopy}
      className="relative size-8 shrink-0 cursor-pointer outline-none flex items-center justify-center rounded-md transition-[background-color] duration-150 hover:bg-[color-mix(in_srgb,var(--on-surface-muted)_10%,transparent)]"
      aria-label="Copy to clipboard"
    >
      {/* Copy icon */}
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="absolute"
        style={{ color: "var(--page-text-muted)", ...show(state === "idle") }}
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {/* Check icon */}
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="absolute"
        style={{ color: SUCCESS_COLOR, ...show(state === "done") }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {/* Error icon */}
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="absolute"
        style={{ color: "var(--page-text-muted)", ...show(state === "error") }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
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

const PM_OPTIONS = ["npm", "pnpm", "yarn", "bun", "skill"] as const;
type PackageManager = (typeof PM_OPTIONS)[number];
const PKG = "@sethihq/scrub-slider";
const PM_STORAGE_KEY = "scrub-slider-pm";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: `npm i ${PKG}`,
  pnpm: `pnpm add ${PKG}`,
  yarn: `yarn add ${PKG}`,
  bun: `bun add ${PKG}`,
  skill: `npx skills add sethihq/scrub-slider`,
};

const PM_ICONS: Record<PackageManager, React.ReactNode> = {
  pnpm: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z" />
    </svg>
  ),
  yarn: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z" />
    </svg>
  ),
  npm: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  ),
  bun: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22.596c6.628 0 12-4.338 12-9.688 0-3.318-2.057-6.248-5.219-7.986-1.286-.715-2.297-1.357-3.139-1.89C14.058 2.025 13.08 1.404 12 1.404c-1.097 0-2.334.785-3.966 1.821a49.92 49.92 0 0 1-2.816 1.697C2.057 6.66 0 9.59 0 12.908c0 5.35 5.372 9.687 12 9.687v.001ZM10.599 4.715c.334-.759.503-1.58.498-2.409 0-.145.202-.187.23-.029.658 2.783-.902 4.162-2.057 4.624-.124.048-.199-.121-.103-.209a5.763 5.763 0 0 0 1.432-1.977Zm2.058-.102a5.82 5.82 0 0 0-.782-2.306v-.016c-.069-.123.086-.263.185-.172 1.962 2.111 1.307 4.067.556 5.051-.082.103-.23-.003-.189-.126a5.85 5.85 0 0 0 .23-2.431Zm1.776-.561a5.727 5.727 0 0 0-1.612-1.806v-.014c-.112-.085-.024-.274.114-.218 2.595 1.087 2.774 3.18 2.459 4.407a.116.116 0 0 1-.049.071.11.11 0 0 1-.153-.026.122.122 0 0 1-.022-.083 5.891 5.891 0 0 0-.737-2.331Zm-5.087.561c-.617.546-1.282.76-2.063 1-.117 0-.195-.078-.156-.181 1.752-.909 2.376-1.649 2.999-2.778 0 0 .155-.118.188.085 0 .304-.349 1.329-.968 1.874Zm4.945 11.237a2.957 2.957 0 0 1-.937 1.553c-.346.346-.8.565-1.286.62a2.178 2.178 0 0 1-1.327-.62 2.955 2.955 0 0 1-.925-1.553.244.244 0 0 1 .064-.198.234.234 0 0 1 .193-.069h3.965a.226.226 0 0 1 .19.07c.05.053.073.125.063.197Zm-5.458-2.176a1.862 1.862 0 0 1-2.384-.245 1.98 1.98 0 0 1-.233-2.447c.207-.319.503-.566.848-.713a1.84 1.84 0 0 1 1.092-.11c.366.075.703.261.967.531a1.98 1.98 0 0 1 .408 2.114 1.931 1.931 0 0 1-.698.869v.001Zm8.495.005a1.86 1.86 0 0 1-2.381-.253 1.964 1.964 0 0 1-.547-1.366c0-.384.11-.76.32-1.079.207-.319.503-.567.849-.713a1.844 1.844 0 0 1 1.093-.108c.367.076.704.262.968.534a1.98 1.98 0 0 1 .4 2.117 1.932 1.932 0 0 1-.702.868Z" />
    </svg>
  ),
  skill: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd">
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  ),
};

function InstallBlock() {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PM_STORAGE_KEY);
      if (stored && PM_OPTIONS.includes(stored as PackageManager)) {
        setPm(stored as PackageManager);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist selection
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PM_STORAGE_KEY, pm);
    } catch {}
  }, [pm, hydrated]);

  const command = INSTALL_COMMANDS[pm];
  const parts = command.split(" ");
  const prefix = pm === "skill" ? parts.slice(0, 3).join(" ") : parts.slice(0, 2).join(" ");
  const pkg = pm === "skill" ? "sethihq/scrub-slider" : PKG;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-3 sm:gap-5 mb-4 select-none">
        {PM_OPTIONS.map((p) => (
          <button
            key={p}
            onClick={() => setPm(p)}
            className="inline-flex items-center gap-1.5 text-[14px] min-h-[40px] cursor-pointer transition-[color,opacity,transform] duration-150 outline-none hover:opacity-70 active:scale-[0.96]"
            style={{
              color: pm === p ? "var(--page-text)" : "var(--page-text-muted)",
              fontWeight: pm === p ? 600 : 400,
              opacity: pm === p ? 1 : 0.4,
            }}
          >
            {PM_ICONS[p]}
            {p}
          </button>
        ))}
      </div>

      {/* Command block */}
      <div className="rounded-2xl border border-[var(--outline)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <pre className="text-[13px] font-mono text-[var(--page-text)] overflow-x-auto select-text">
            <code>
              <span className="select-none text-[var(--page-text-muted)]">$ </span>
              <Calligraph animation="smooth" drift={{ x: 8, y: 0 }} stagger={0.03}>
                {prefix}
              </Calligraph>
              <span> {pkg}</span>
            </code>
          </pre>
          <CopyButton text={command} />
        </div>
      </div>
    </div>
  );
}

/* ── Usage Block with framework tabs ───────────────── */

const FRAMEWORKS = ["React", "TypeScript", "Vue", "Svelte"] as const;

function UsageBlock({ enableSound, enableHaptics, chipPosition, showChip, sliderMin, sliderMax, sliderStep }: {
  enableSound: boolean; enableHaptics: boolean; chipPosition: string; showChip: boolean; sliderMin: number; sliderMax: number; sliderStep: number;
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
    !showChip ? "  showChip={false}" : "",
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
    :step="${sliderStep}"${!enableSound ? '\n    :enable-sound="false"' : ""}${!enableHaptics ? '\n    :enable-haptics="false"' : ""}${chipPosition !== "top" ? `\n    chip-position="${chipPosition}"` : ""}${!showChip ? '\n    :show-chip="false"' : ""}
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
  step={${sliderStep}}${!enableSound ? "\n  enableSound={false}" : ""}${!enableHaptics ? "\n  enableHaptics={false}" : ""}${chipPosition !== "top" ? `\n  chipPosition="${chipPosition}"` : ""}${!showChip ? "\n  showChip={false}" : ""}
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
      { prop: "showChip", type: "boolean", default: "true", desc: "Show hover chip", required: false },
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
    const onScroll = () => setNavVisible(window.scrollY > 20);
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

/* ── Pixel Canvas (Easter Egg) ─────────────────────── */

const CELL_SIZE = 12;
const CANVAS_ROWS = 16;

function PixelCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Set<string>>(new Set());
  const drawingRef = useRef(false);
  const hoveredRef = useRef(false);
  const colsRef = useRef(0);

  const getColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      surface: style.getPropertyValue("--surface").trim() || "#ffffff",
      draw: style.getPropertyValue("--on-surface-muted").trim() || "#737373",
      grid: style.getPropertyValue("--outline").trim() || "#e5e5e5",
    };
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = colsRef.current;
    const rows = CANVAS_ROWS;
    const colors = getColors();

    // Clear and fill background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colors.surface;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = colors.grid;
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      const px = x * CELL_SIZE + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, rows * CELL_SIZE);
    }
    for (let y = 0; y <= rows; y++) {
      const py = y * CELL_SIZE + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(cols * CELL_SIZE, py);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw filled pixels
    ctx.fillStyle = colors.draw;
    for (const key of pixelsRef.current) {
      const [cx, cy] = key.split(",").map(Number);
      ctx.fillRect(cx * CELL_SIZE, cy * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }, [getColors]);

  const fillCell = useCallback((e: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    if (x < 0 || y < 0 || x >= colsRef.current || y >= CANVAS_ROWS) return;
    const key = `${x},${y}`;
    if (!pixelsRef.current.has(key)) {
      pixelsRef.current.add(key);
      drawCanvas();
    }
  }, [drawCanvas]);

  // Canvas sizing + ResizeObserver + theme observer
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const width = container.clientWidth;
      const cols = Math.floor(width / CELL_SIZE);
      colsRef.current = cols;
      canvas.width = cols * CELL_SIZE;
      canvas.height = CANVAS_ROWS * CELL_SIZE;
      canvas.style.width = `${cols * CELL_SIZE}px`;
      canvas.style.height = `${CANVAS_ROWS * CELL_SIZE}px`;
      drawCanvas();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Theme change detection
    const mo = new MutationObserver(() => {
      requestAnimationFrame(drawCanvas);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [drawCanvas]);

  // Pointer event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: PointerEvent) => {
      drawingRef.current = true;
      canvas.setPointerCapture(e.pointerId);
      fillCell(e);
    };

    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      fillCell(e);
    };

    const onUp = () => {
      drawingRef.current = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [fillCell]);

  // Keyboard shortcuts (S = save, C = clear) while hovered
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!hoveredRef.current) return;
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "scrub-sketch.png";
    a.click();
  };

  const handleClear = () => {
    pixelsRef.current.clear();
    drawCanvas();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border border-[var(--outline)] overflow-hidden"
      onPointerEnter={() => { hoveredRef.current = true; }}
      onPointerLeave={() => { hoveredRef.current = false; }}
    >
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair touch-none"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Toolbar */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 select-none">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-[background-color,opacity] duration-150 cursor-pointer outline-none hover:opacity-80 active:scale-[0.97]"
          style={{ backgroundColor: "var(--outline)", color: "var(--page-text-muted)" }}
        >
          <kbd className="inline-flex items-center justify-center rounded px-1 py-px text-[10px] font-mono leading-none" style={{ backgroundColor: "color-mix(in srgb, var(--on-surface-muted) 15%, transparent)" }}>S</kbd>
          Save
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-[background-color,opacity] duration-150 cursor-pointer outline-none hover:opacity-80 active:scale-[0.97]"
          style={{ backgroundColor: "var(--outline)", color: "var(--page-text-muted)" }}
        >
          <kbd className="inline-flex items-center justify-center rounded px-1 py-px text-[10px] font-mono leading-none" style={{ backgroundColor: "color-mix(in srgb, var(--on-surface-muted) 15%, transparent)" }}>C</kbd>
          Clear
        </button>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────── */

export default function Page() {
  const [frequency, setFrequency] = useState(0.65);
  const [enableSound, setEnableSound] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [chipPosition, setChipPosition] = useState<"top" | "bottom">("top");
  const [showChip, setShowChip] = useState(true);
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
                showChip={showChip}
              />
              <div className="rounded-2xl border border-[var(--outline)] px-4 divide-y divide-[var(--outline)]">
                <Toggle label="Sound" checked={enableSound} onChange={setEnableSound} />
                <Toggle label="Haptics" checked={enableHaptics} onChange={setEnableHaptics} />
                <SegmentedControl label="Chip" options={["top", "bottom"]} value={chipPosition} onChange={(v) => setChipPosition(v as "top" | "bottom")} />
                <Toggle label="Show Chip" checked={showChip} onChange={setShowChip} />
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
            showChip={showChip}
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
        <footer className="flex flex-col items-center gap-6 pb-20 text-[13px] text-[var(--page-text-muted)]">
          <div className="w-full" style={entranceStyle(6)}>
            <PixelCanvas />
          </div>
          <div style={entranceStyle(7)}>
            <MadeWithLove />
          </div>
        </footer>

      </div>
    </div>
  );
}
