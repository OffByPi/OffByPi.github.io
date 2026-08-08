import { describe, expect, it } from "vitest";
import { NoindexTags } from "../src/index";
import type { QuartzPluginData } from "@quartz-community/types";

function getRobotsMeta(slug: string) {
  const plugin = NoindexTags();
  const additionalHead = plugin.externalResources!({} as never)?.additionalHead ?? [];
  const headFn = additionalHead[0] as (fileData: QuartzPluginData) => unknown;
  return headFn({ slug } as QuartzPluginData);
}

describe("NoindexTags externalResources", () => {
  it("emits a noindex,nofollow robots meta tag on the tags index page", () => {
    const result = getRobotsMeta("tags") as { props: { name: string; content: string } };
    expect(result.props.name).toBe("robots");
    expect(result.props.content).toBe("noindex, nofollow");
  });

  it("emits a noindex,nofollow robots meta tag on individual tag pages", () => {
    const result = getRobotsMeta("tags/dev") as { props: { name: string; content: string } };
    expect(result.props.name).toBe("robots");
    expect(result.props.content).toBe("noindex, nofollow");
  });

  it("emits nothing for regular pages", () => {
    expect(getRobotsMeta("notes/real-post")).toBe("");
  });
});
