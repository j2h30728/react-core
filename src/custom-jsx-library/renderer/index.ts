import { componentManager, stateManager } from "custom-jsx-library/core";
import { JSXElement } from "custom-jsx-library/types";

export const render = (component: () => JSXElement, container: HTMLElement) => {
  componentManager.setComponent(component, container);
  stateManager.resetIndex();
  componentManager.render();
};
