import { JSX } from "./types";

export const jsx: JSX = (type, props, key) => {
  return {
    type,
    props: props || {},
    key,
  };
};
export const jsxs: JSX = (type, config, key) => {
  return jsx(type, config, key);
};

export const Fragment = Symbol.for("jsx.fragment");
