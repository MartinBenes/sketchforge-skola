import { afterEach, describe, expect, it, vi } from "vitest";
import { publicPath } from "@/lib/publicPath";

afterEach(() => vi.unstubAllEnvs());

describe("public paths", () => {
  it("resolves assets at the site root for local and custom-domain hosting", () => {
    expect(publicPath("assets/icon.png", "")).toBe("/assets/icon.png");
    expect(publicPath("/occt/occt-wasm.wasm", "/")).toBe("/occt/occt-wasm.wasm");
  });

  it("uses the configured repository path for images, runtime modules and navigation", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/sketchforge-skola");
    expect(publicPath("assets/icon.png")).toBe("/sketchforge-skola/assets/icon.png");
    expect(publicPath("/occt/occt-wasm.wasm")).toBe("/sketchforge-skola/occt/occt-wasm.wasm");
    expect(publicPath("/")).toBe("/sketchforge-skola/");
    expect(publicPath("/?editor=1&project=a%20b")).toBe("/sketchforge-skola/?editor=1&project=a%20b");
    expect(publicPath("assets/sprite.svg?v=2#icon", "sketchforge-skola/")).toBe("/sketchforge-skola/assets/sprite.svg?v=2#icon");
  });

  it("preserves external and embedded resource URLs", () => {
    for (const url of ["https://example.org/image.png", "//example.org/image.png", "data:image/png;base64,AA==", "blob:https://example.org/image-id"]) {
      expect(publicPath(url, "/sketchforge-skola")).toBe(url);
    }
  });
});
