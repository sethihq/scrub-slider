"use client";

import { useState } from "react";
import { Clawd } from "clawd-react";

export function MadeWithLove() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative font-sans pointer-events-auto">
      {/* Clawd — positioned absolutely, outside any overflow-hidden wrapper */}
      <div
        className="absolute transition-[opacity,transform] duration-300 pointer-events-none"
        style={{
          right: -50,
          bottom: -2,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1) translateY(0)" : "scale(0.6) translateY(4px)",
          transformOrigin: "bottom center",
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <Clawd mood="happy" scale={0.3} />
      </div>

      <span
        className="inline-flex items-center gap-1 text-[11px] tracking-wide text-[var(--page-text-muted)] transition-[color] duration-300"
      >
        <span>made with love by</span>
        <a
          href="https://x.com/intent/follow?screen_name=sethihq"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-0.5 -my-0.5 text-[var(--page-text-muted)] transition-[background-color,color] duration-200 ease-[var(--ease-out-quart)]"
          style={{ backgroundColor: hovered ? "var(--toolbar-border)" : "transparent" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src="https://unavatar.io/x/sethihq"
            alt=""
            className="size-4 rounded-full object-cover"
            style={{ boxShadow: "0 0 0 1px var(--toolbar-border)" }}
          />
          <span className="font-medium">sethihq</span>
        </a>

        {/* "+" appears next to pill on hover */}
        <span
          className="inline-flex items-center overflow-hidden transition-[max-width,opacity] duration-300"
          style={{
            maxWidth: hovered ? 20 : 0,
            opacity: hovered ? 1 : 0,
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <span className="shrink-0 ml-1">+</span>
        </span>
      </span>
    </div>
  );
}
