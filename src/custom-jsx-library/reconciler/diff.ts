import { createDOMNode, removeEventListener, setAttribute } from "custom-jsx-library/renderer/render";
import { JSXElement, JSXNode, JSXProps } from "custom-jsx-library/types";

const isJSXNode = (node: JSXElement): node is JSXNode => {
  return typeof node === "object" && node !== null && "type" in node && "props" in node;
};

const executeComponent = (vNode: JSXNode): JSXElement => {
  const { type, props } = vNode;

  if (typeof type === "function") {
    return type(props);
  }

  return vNode;
};

const diffProps = (oldProps: JSXProps, newProps: JSXProps): boolean => {
  const { children: oldChildren, ...oldWithoutChildren } = oldProps;
  const { children: newChildren, ...newWithoutChildren } = newProps;

  const oldKeys = Object.keys(oldWithoutChildren);
  const newKeys = Object.keys(newWithoutChildren);

  if (oldKeys.length !== newKeys.length) {
    return true;
  }

  for (const key of newKeys) {
    if (!(key in oldWithoutChildren) || oldWithoutChildren[key] !== newWithoutChildren[key]) {
      return true;
    }
  }

  return false;
};

const diffChildren = (parent: HTMLElement, oldChildren: JSXElement[], newChildren: JSXElement[]) => {
  const oldLength = oldChildren.length;
  const newLength = newChildren.length;
  const length = Math.max(oldLength, newLength);

  for (let i = 0; i < length; i++) {
    const childNodeIndex = Math.min(i, parent.childNodes.length - 1);

    diff(parent, oldChildren[i], newChildren[i], childNodeIndex >= 0 ? childNodeIndex : 0);
  }
};

export const diff = (
  parent: HTMLElement,
  oldNode: JSXElement | null,
  newNode: JSXElement | null,
  index: number = 0
) => {
  if (newNode && isJSXNode(newNode) && typeof newNode.type === "function") {
    newNode = executeComponent(newNode);
  }

  if (oldNode && isJSXNode(oldNode) && typeof oldNode.type === "function") {
    oldNode = executeComponent(oldNode);
  }

  if (oldNode === null || oldNode === undefined) {
    if (newNode !== null && newNode !== undefined) {
      const node = createDOMNode(newNode);
      if (node) {
        parent.appendChild(node);
      }
    }
    return;
  }

  if (newNode === null || newNode === undefined) {
    if (index < parent.childNodes.length) {
      parent.removeChild(parent.childNodes[index]);
    }
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode === newNode) return;

    const textNode = document.createTextNode(String(newNode));
    if (index < parent.childNodes.length) {
      parent.replaceChild(textNode, parent.childNodes[index]);
    } else {
      parent.appendChild(textNode);
    }
    return;
  }

  if (typeof oldNode !== typeof newNode) {
    const node = createDOMNode(newNode);
    if (node) {
      if (index < parent.childNodes.length) {
        parent.replaceChild(node, parent.childNodes[index]);
      } else {
        parent.appendChild(node);
      }
    }
    return;
  }

  if (isJSXNode(oldNode) && isJSXNode(newNode)) {
    if (oldNode.type !== newNode.type) {
      const node = createDOMNode(newNode);
      if (node) {
        if (index < parent.childNodes.length) {
          parent.replaceChild(node, parent.childNodes[index]);
        } else {
          parent.appendChild(node);
        }
      }
      return;
    }

    if (index < parent.childNodes.length) {
      const currentNode = parent.childNodes[index] as HTMLElement;

      if (diffProps(oldNode.props, newNode.props)) {
        removeEventListener(currentNode, oldNode.props);
        setAttribute(currentNode, newNode.props);
      }

      const oldChildren = Array.isArray(oldNode.props.children)
        ? oldNode.props.children
        : oldNode.props.children
        ? [oldNode.props.children]
        : [];

      const newChildren = Array.isArray(newNode.props.children)
        ? newNode.props.children
        : newNode.props.children
        ? [newNode.props.children]
        : [];

      diffChildren(currentNode, oldChildren, newChildren);
    }
    return;
  }

  const node = createDOMNode(newNode);
  if (node) {
    if (index < parent.childNodes.length) {
      parent.replaceChild(node, parent.childNodes[index]);
    } else {
      parent.appendChild(node);
    }
  }
};
