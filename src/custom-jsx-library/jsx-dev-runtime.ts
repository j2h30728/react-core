import { jsx, JSXProps } from "custom-jsx-library/jsx-runtime";

export function jsxDEV(type: string, props: JSXProps, key: string) {
  return jsx(type, props, key);
}
