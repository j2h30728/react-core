import { Fragment } from "../jsx-runtime";
import { JSXElement, JSXProps } from "../types";

// 유틸
const convertStyleName = (camelCase: string): string => {
  return camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();
};

const setAttribute = (element: HTMLElement, props: Record<string, any>): void => {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value as EventListener);
      return;
    }
    if (key === "style" && typeof value === "object") {
      const elementStyle = Object.entries(value)
        .map(([styleKey, styleValue]) => `${convertStyleName(styleKey)}: ${styleValue}`)
        .join("; ");
      element.style.cssText = elementStyle;
      return;
    }

    element.setAttribute(key, String(value));
  });
};

// DOM 노드 생성
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

// 자식 노드 추가
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

// 메인 렌더링 함수
export const createDOMNode = (vNode: JSXElement): Node | null => {
  if (vNode === null || vNode === undefined) return null;
  if (typeof vNode === "string" || typeof vNode === "number") return document.createTextNode(String(vNode));

  const { type, props = {} } = vNode;
  if (type === Fragment) {
    return createFragmentNode(props.children);
  } else {
    return createElementNode(type as string, props);
  }
};

export const renderToDOM = (vNode: JSXElement, container: HTMLElement): void => {
  const node = createDOMNode(vNode);
  if (node !== null) container.appendChild(node);
};
