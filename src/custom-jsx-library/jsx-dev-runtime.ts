import { jsx, JSXProps } from "custom-jsx-library/jsx-runtime";

export function jsxDEV(type: string, config: JSXProps, key: string) {
  return jsx(type, config, key);
}
export const Fragment = Symbol.for("jsx.fragment");
