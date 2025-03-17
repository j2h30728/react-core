import { Fragment } from "./jsx-runtime";
import { JSXElement, JSXProps } from "./types";

const createFragmentNode = (children: JSXElement | JSXElement[]) => {
  const fragment = document.createDocumentFragment();
  appendChildren(fragment, children);

  return fragment;
};

const createElementNode = (type: string, props: JSXProps) => {
  const element = document.createElement(type);
  const { children, ...withOutChildrenProps } = props;

  setAttribute(element, withOutChildrenProps);
  appendChildren(element, children);

  return element;
};

const appendChildren = (parent: Node, children?: JSXElement | JSXElement[]) => {
  if (!children) return;

  if (Array.isArray(children)) {
    children.forEach((child) => parent.appendChild(createDOMNode(child)));
  } else if (children) {
    parent.appendChild(createDOMNode(children));
  }
};

const convertStyleName = (camelCase: string): string => {
  return camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();
};

const setAttribute = (element: HTMLElement, props: Record<string, any>) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value as EventListener);
      return;
    }
    if (key === "style" && typeof value === "object") {
      let elementStyle = "";
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        elementStyle += `${convertStyleName(styleKey)} : ${styleValue}; `;
      });
      element.style.cssText = elementStyle;
      return;
    }

    element.setAttribute(key, String(value));
  });
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
    return createFragmentNode(props.children);
  }
  return createElementNode(type as string, props);
};

export const render = (vNode: JSXElement, container: HTMLElement): void => {
  container.appendChild(createDOMNode(vNode));
};
