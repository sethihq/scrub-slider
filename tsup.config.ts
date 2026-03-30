import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  entry: {
    slider: "components/ui/slider.tsx",
    "use-haptics": "hooks/use-haptics.ts",
    "use-sound": "hooks/use-sound.ts",
    utils: "lib/utils.ts",
  },
  format: ["esm"],
  tsconfig: "tsconfig.build.json",
  dts: {
    tsconfig: "tsconfig.build.json",
  },
  external: [
    "react",
    "react-dom",
    "@radix-ui/react-slider",
    "@number-flow/react",
    "web-haptics",
    "web-haptics/react",
    "clsx",
    "tailwind-merge",
  ],
  outDir: "dist",
  clean: true,
  outExtension() {
    return { js: ".js", dts: ".d.ts" };
  },
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "."),
    };
  },
});
