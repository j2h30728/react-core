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
export type Key = string | number | bigint | undefined;
