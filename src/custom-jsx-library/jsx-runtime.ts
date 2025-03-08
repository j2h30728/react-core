import { createElement } from "./core";
import { JSX } from "./types";

export const jsx: JSX = (type, config, _key) => {
  const props = { ...config };
  const children = config.children || [];

  return createElement(type, props, children);
};

export const jsxs: JSX = (type, config, key) => {
  return jsx(type, config, key);
};

export const Fragment = Symbol.for("jsx.fragment");
