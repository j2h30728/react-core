export interface JSXProps {
  children?: JSXElement | JSXElement[];
  [key: string]: unknown;
}

export interface JSXNode {
  type: ElementType;
  props: JSXProps;
  key: Key;
}
export type Component = (props: JSXProps) => VirtualDOM;

export type ElementType = keyof HTMLElementTagNameMap | Component | Symbol;
export type JSXElement = JSXNode | string | number | null | undefined;

export type JSX = (type: ElementType, props: JSXProps, key?: Key) => JSXElement;
export type Key = string | number | bigint | undefined;

export type VirtualDOM = JSXElement;
export type Container = HTMLElement & { _vdom?: JSXElement };

export type SetStateAction<T> = T | ((prevState: T) => T);
export type Dispatch<A> = (action: A) => void;
export type StateUpdate<T> = { index: number; action: SetStateAction<T> };

declare global {
  interface HTMLElement {
    _eventHandlers: Record<string, EventListener>;
  }
}
