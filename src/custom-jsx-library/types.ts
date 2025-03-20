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

export type SetStateAction<T> = T | ((prevState: T) => T);
export type Dispatch<A> = (action: A) => void;
export type StateUpdate = { index: number; action: SetStateAction<any> };
