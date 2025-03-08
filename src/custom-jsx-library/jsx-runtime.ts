import { createElement, Key } from "./core";

export interface JSXProps {
  children?: any;
  [key: string]: any;
}

export interface JSXNode {
  type: ElementType;
  config: JSXProps;
  key: Key;
}
export type ElementType = string | Function;
export type JSXElement = JSXNode | string | number | boolean | null | undefined;

export type JSX = (type: ElementType, config: JSXProps, key?: Key) => any;

export const jsx: JSX = (type, config, _key) => {
  const props = { ...config };
  const children = config.children || [];

  return createElement(type, props, children);
};

export const jsxs: JSX = (type, config, key) => {
  return jsx(type, config, key);
};
export const jsxDEV: JSX = (type, config, key) => {
  return jsx(type, config, key);
};

export const Fragment = Symbol.for("jsx.fragment");
