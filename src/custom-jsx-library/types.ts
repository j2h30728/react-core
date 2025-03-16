export interface JSXProps {
  children?: JSXElement | JSXElement[];
  [key: string]: unknown;
}

export interface JSXNode {
  type: ElementType;
  props: JSXProps;
  key: Key;
}
export type ElementType = keyof HTMLElementTagNameMap | Function | Symbol;
export type JSXElement = JSXNode | string | number | boolean | null | undefined;

export type JSX = (type: ElementType, props: JSXProps, key?: Key) => JSXNode;
export type Key = string | number | bigint | undefined;
