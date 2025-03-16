import { Fragment } from "./jsx-runtime";
import { ElementType, JSXElement, JSXProps, Key } from "./types";

export const createElement = (type: ElementType, props: JSXProps, key: Key): any => {
  if (typeof type === "function") {
    return type(props);
  }
  return { type, props, key };
};

export const renderToString = (vNode: JSXElement): string => {
  // console.log("vNode", vNode.props.children);
  if (vNode === null || vNode === undefined) {
    return "";
  }

  if (typeof vNode !== "object") {
    return String(vNode);
  }

  const { type, props = {}, key } = vNode;

  if (type === Fragment) {
    const children = props.children || [];
    if (Array.isArray(children)) {
      return children.map((child) => renderToString(child)).join("");
    }
    return renderToString(children);
  }
  const { children, ...withOutChildrenProps } = props;
  const propsString = Object.entries(withOutChildrenProps)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ");

  if (!children) {
    return `<${type} ${propsString} />`;
  }

  if (Array.isArray(children)) {
    const childrenString = children.map(renderToString).join("");
    return `<${type} ${propsString}>${childrenString}</${type}>`;
  }

  return `<${type} ${propsString}>${renderToString(children)}</${type}>`;
};

export const render = (vNode: JSXElement, container: HTMLElement): void => {
  const html = renderToString(vNode);
  container.innerHTML = html;
};
