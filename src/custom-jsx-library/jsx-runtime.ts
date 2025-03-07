export type ElementType = string;
export interface JSXProps {
  children?: any;
  [key: string]: any;
}

export interface JSXNode {
  type: ElementType;
  props: JSXProps;
  key: string | null;
}

export type JSXElement = JSXNode | string | number | boolean | null | undefined;

export function jsx(type: string, props: JSXProps, key: string) {
  return { type, props, key };
}

export function jsxs(type: string, props: JSXProps, key: string) {
  return jsx(type, props, key);
}
export function jsxDEV(type: string, props: JSXProps, key: string) {
  return jsx(type, props, key);
}

export const Fragment = Symbol.for("jsx.fragment");
