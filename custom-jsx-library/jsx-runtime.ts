export function jsx(type, props, key) {
  return { type, props, key };
}

export function jsxs(type, props, key) {
  return jsx(type, props, key);
}

export const Fragment = Symbol.for("jsx.fragment");
