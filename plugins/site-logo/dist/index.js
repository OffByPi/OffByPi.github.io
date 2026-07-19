// ../../node_modules/github-slugger/index.js

// node_modules/@quartz-community/utils/dist/path.js
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function stripSlashes(s2, onlyStripPrefix) {
  if (s2.startsWith("/")) {
    s2 = s2.substring(1);
  }
  if (s2.endsWith("/")) {
    s2 = s2.slice(0, -1);
  }
  return s2;
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_2) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/SiteLogo.tsx
var SiteLogo = ({ fileData, cfg, displayClass }) => {
  const baseDir = pathToRoot(fileData.slug);
  const logoSrc = joinSegments(baseDir, "static/logo-header.svg");
  const title = cfg?.pageTitle ?? "Home";
  return /* @__PURE__ */ u2("a", { href: baseDir, class: classNames(displayClass, "page-logo"), "aria-label": title, children: [
    /* @__PURE__ */ u2("img", { src: logoSrc, alt: "", width: "141", height: "44" }),
    /* @__PURE__ */ u2("span", { class: "page-logo-text", children: title })
  ] });
};
SiteLogo.css = `
.page-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.page-logo img {
  height: 2.75rem;
  width: auto;
  flex-shrink: 0;
  display: block;
}
.page-logo-text {
  font-family: var(--headerFont);
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--secondary);
  white-space: nowrap;
}
`;
var SiteLogo_default = (() => SiteLogo);

export { SiteLogo_default as SiteLogo };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map