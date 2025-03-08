import { ElementType, JSXProps } from "./types";

export const createElement = (type: ElementType, props: JSXProps, ..._children: any[]): any => {
  if (typeof type === "function") {
    const result = type(props);
    return createElement(type.name, result.props);
  }

  return { type, props };
};
