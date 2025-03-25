import { JSX } from "./types";

export const jsx: JSX = (type, props, key) => {
  if (typeof type === "function") {
    return type(props);
  }
  return { type, props, key };
};

export const jsxs: JSX = (type, config, key) => {
  return jsx(type, config, key);
};

export const Fragment = Symbol.for("jsx.fragment");
