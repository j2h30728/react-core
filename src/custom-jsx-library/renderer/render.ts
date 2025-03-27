import { Fragment } from "../jsx-runtime";
import { Container, JSXElement, JSXProps } from "../types";
import { diff } from "../reconciler/diff";

const convertStyleName = (camelCase: string): string => {
  return camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();
};

const isInputOrTextarea = (element: HTMLElement): boolean => {
  return element.tagName === "INPUT" || element.tagName === "TEXTAREA";
};

export const removeEventListener = (element: HTMLElement, props: Record<string, any>): void => {
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on") && typeof props[key] === "function") {
      let eventName = key.slice(2).toLowerCase();
      if (eventName === "change" && isInputOrTextarea(element)) {
        eventName = "input";
      }
      element.removeEventListener(eventName, props[key] as EventListener);
    }
  });
};

export const setAttribute = (element: HTMLElement, props: Record<string, any>): void => {
  if (!element._eventHandlers) {
    element._eventHandlers = {};
  }
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      let eventName = key.slice(2).toLowerCase();
      if (eventName === "change" && isInputOrTextarea(element)) {
        eventName = "input";
      }

      if (element._eventHandlers[eventName]) {
        element.removeEventListener(eventName, element._eventHandlers[eventName]);
      }

      element.addEventListener(eventName, value);
      element._eventHandlers[eventName] = value;

      return;
    }

    if (key === "style" && typeof value === "object") {
      const elementStyle = Object.entries(value)
        .map(([styleKey, styleValue]) => `${convertStyleName(styleKey)}: ${styleValue}`)
        .join("; ");
      element.style.cssText = elementStyle;
      return;
    }

    if (value === null || value === undefined) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, String(value));
    }
  });
};

const createFragmentNode = (children: JSXElement | JSXElement[]): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  if (!children) return fragment;
  appendChildren(fragment, children);
  return fragment;
};

const createElementNode = (type: string, props: JSXProps): HTMLElement => {
  const element = document.createElement(type);
  const { children, ...withOutChildrenProps } = props;
  setAttribute(element, withOutChildrenProps);
  if (children) appendChildren(element, children);
  return element;
};

const appendChild = (parent: Node, child: JSXElement) => {
  const node = createDOMNode(child);
  if (node !== null) parent.appendChild(node);
};

const appendChildren = (parent: Node, children?: JSXElement | JSXElement[]) => {
  if (children === null || children === undefined) return;

  if (Array.isArray(children) && children.length === 0) return;

  if (Array.isArray(children)) {
    children
      .filter((child): child is JSXElement => child !== null && child !== undefined)
      .forEach((child) => appendChild(parent, child));
    return;
  }
  appendChild(parent, children);
};

export const createDOMNode = (vNode: JSXElement): Node | null => {
  if (vNode === null || vNode === undefined) return null;
  if (typeof vNode === "string" || typeof vNode === "number") return document.createTextNode(String(vNode));

  if (typeof vNode === "object" && "type" in vNode) {
    if (typeof vNode.type === "function") {
      const result = vNode.type(vNode.props);
      return createDOMNode(result);
    }

    const { type, props = {} } = vNode;
    if (type === Fragment) {
      return createFragmentNode(props.children);
    }
    return createElementNode(type as string, props);
  }

  return null;
};

export const renderToDOM = (vNode: JSXElement, container: Container): void => {
  if (!container._vdom) {
    container.innerHTML = "";
    const node = createDOMNode(vNode);
    if (node !== null) container.appendChild(node);
  } else {
    diff(container, container._vdom, vNode);
  }

  container._vdom = vNode;
};
