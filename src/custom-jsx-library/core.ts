import { ElementType } from "custom-jsx-library/jsx-runtime";

export type Key = string | number | bigint | undefined;

export const createElement = (type: ElementType, props: any, _children: any[]) => {
  return { type, props };
};
