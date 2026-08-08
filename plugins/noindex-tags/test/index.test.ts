import { describe, expect, it } from "vitest";
import { NoindexTags } from "../src/index";
import type { BuildCtx, QuartzConfig } from "@quartz-community/types";

function createCtx(): BuildCtx {
  return {
    buildId: "test-build",
    argv: {
      directory: "content",
      verbose: false,
      output: "public",
      serve: false,
      watch: false,
      port: 0,
      wsPort: 0,
    },
    cfg: {
      configuration: {
        baseUrl: "example.com",
        pageTitle: "Test Site",
      },
    } as QuartzConfig,
    allSlugs: [],
    allFiles: [],
    incremental: false,
  };
}

function runHtmlPlugin(slug: string): Record<string, unknown> {
  const plugin = NoindexTags();
  const [transformerFactory] = plugin.htmlPlugins!(createCtx());
  const transformer = (
    transformerFactory as () => (tree: unknown, file: { data: Record<string, unknown> }) => void
  )();
  const file = { data: { slug } };
  transformer(undefined, file);
  return file.data;
}

describe("NoindexTags htmlPlugins", () => {
  it("flags the tags index page as noindex", () => {
    expect(runHtmlPlugin("tags").noindex).toBe(true);
  });

  it("flags individual tag pages as noindex", () => {
    expect(runHtmlPlugin("tags/dev").noindex).toBe(true);
  });

  it("leaves regular pages unflagged", () => {
    expect(runHtmlPlugin("notes/real-post").noindex).toBeUndefined();
  });
});
