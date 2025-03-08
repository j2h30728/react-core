import { jsx } from "./jsx-runtime";
import { JSXProps } from "./types";

export function jsxDEV(type: string, config: JSXProps, key: string) {
  return jsx(type, config, key);
}
export const Fragment = Symbol.for("jsx.fragment");
