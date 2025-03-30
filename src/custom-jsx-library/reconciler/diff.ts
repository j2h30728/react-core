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

const createKeyMap = (children: JSXElement[]) => {
  const keyMap = new Map<string, { element: JSXElement; index: number }>();
  const nonKeyed: { element: JSXElement; index: number }[] = [];

  children.forEach((child, index) => {
    if (isJSXNode(child) && child.key) {
      keyMap.set(String(child.key), { element: child, index });
    } else {
      nonKeyed.push({ element: child, index });
    }
  });

  return { keyMap, nonKeyed };
};

const diffKeyedChildren = (
  parent: HTMLElement,
  oldKeyMap: Map<string, { element: JSXElement; index: number }>,
  newKeyMap: Map<string, { element: JSXElement; index: number }>
) => {
  for (const [key, newChild] of newKeyMap) {
    const oldChild = oldKeyMap.get(key);
    if (oldChild) {
      diff(parent, oldChild.element, newChild.element, oldChild.index);
    } else {
      const node = createDOMNode(newChild.element);
      if (node) {
        parent.appendChild(node);
      }
    }
  }
  for (const [key, oldChild] of oldKeyMap) {
    if (!newKeyMap.has(key)) {
      const childNode = parent.childNodes[oldChild.index];
      if (childNode) {
        parent.removeChild(childNode);
      }
    }
  }
};

const diffNonKeyedChildren = (
  parent: HTMLElement,
  oldNonKeyed: { element: JSXElement; index: number }[],
  newNonKeyed: { element: JSXElement; index: number }[]
) => {
  const length = Math.max(oldNonKeyed.length, newNonKeyed.length);

  for (let i = 0; i < length; i++) {
    const oldChild = oldNonKeyed[i];
    const newChild = newNonKeyed[i];
    const childNodeIndex = Math.min(i, parent.childNodes.length - 1);

    if (oldChild && newChild) {
      diff(parent, oldChild.element, newChild.element, oldChild.index);
    } else if (newChild) {
      const node = createDOMNode(newChild.element);
      if (node) {
        parent.appendChild(node);
      }
    } else if (oldChild && childNodeIndex >= 0) {
      parent.removeChild(parent.childNodes[childNodeIndex]);
    }
  }
};

const diffChildren = (parent: HTMLElement, oldChildren: JSXElement[], newChildren: JSXElement[]) => {
  const { keyMap: oldKeyMap, nonKeyed: oldNonKeyed } = createKeyMap(oldChildren);
  const { keyMap: newKeyMap, nonKeyed: newNonKeyed } = createKeyMap(newChildren);

  diffKeyedChildren(parent, oldKeyMap, newKeyMap);
  diffNonKeyedChildren(parent, oldNonKeyed, newNonKeyed);
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
