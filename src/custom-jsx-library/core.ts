import { ElementType, JSXProps, Key } from "./types";

export const createElement = (type: ElementType, props: JSXProps, key: Key): any => {
  if (typeof type === "function") {
    return type(props);
  }
  return { type, props, key };
};
