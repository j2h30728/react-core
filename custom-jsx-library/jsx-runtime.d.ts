// TODO: 추후 보완
declare module "custom-jsx-library/jsx-runtime" {
  export function jsx(tag: string, props: { [key: string]: any }, key: string): any;
  export function jsxs(tag: string, props: { [key: string]: any }, key: string): any;
  export const Fragment: unique symbol;
}
