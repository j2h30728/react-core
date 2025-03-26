import { JSX } from "./types";

export const jsx: JSX = (type, props, key) => {
  // 함수형 컴포넌트를 즉시 실행하지 않고, 참조만 저장
  return {
    type,
    props: props || {},
    key,
  };
};
export const jsxs: JSX = (type, config, key) => {
  return jsx(type, config, key);
};

export const Fragment = Symbol.for("jsx.fragment");
