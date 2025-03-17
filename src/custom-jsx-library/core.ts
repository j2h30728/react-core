import { Fragment } from "./jsx-runtime";
import { ElementType, JSXElement, JSXProps, Key } from "./types";

export const createElement = (type: ElementType, props: JSXProps, key: Key): any => {
  if (typeof type === "function") {
    return type(props);
  }
  return { type, props, key };
};

export const createDOMNode = (vNode: JSXElement): Node => {
  if (vNode === null || vNode === undefined) {
    return document.createTextNode("");
  }

  if (typeof vNode !== "object") {
    return document.createTextNode(String(vNode));
  }

  const { type, props = {}, key } = vNode;

  if (type === Fragment) {
    const fragment = document.createDocumentFragment();
    const children = props.children || [];
    if (Array.isArray(children)) {
      children.forEach((child) => fragment.appendChild(createDOMNode(child)));
    } else {
      fragment.appendChild(createDOMNode(children));
    }
    return fragment;
  }
  const element = document.createElement(type as string);

  const { children, ...withOutChildrenProps } = props;

  Object.entries(withOutChildrenProps).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value as EventListener);
      return;
    }

    element.setAttribute(key, String(value));
  });

  if (Array.isArray(children)) {
    children.forEach((child) => element.appendChild(createDOMNode(child)));
  } else if (children) {
    element.appendChild(createDOMNode(children));
  }

  return element;
};

export const render = (vNode: JSXElement, container: HTMLElement): void => {
  container.appendChild(createDOMNode(vNode));
};
