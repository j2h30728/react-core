import { renderToDOM } from "./render";
import { Dispatch, ElementType, JSXElement, JSXProps, Key, SetStateAction, StateUpdate } from "./types";

export const createElement = (type: ElementType, props: JSXProps, key: Key): any => {
  if (typeof type === "function") {
    return type(props);
  }
  return { type, props, key };
};

let currentComponent: (() => JSXElement) | null = null;
let currentContainer: HTMLElement | null = null;
let hookIndex = 0;
let states: any[] = [];
let updateQueue: StateUpdate[] = [];
let isUpdateScheduled = false;

export function render(component: () => JSXElement, container: HTMLElement): void {
  container.innerHTML = "";
  currentComponent = component;
  currentContainer = container;
  hookIndex = 0;

  const vNode = component();
  renderToDOM(vNode, container);
}

const processUpdateQueue = () => {
  isUpdateScheduled = false;

  const currentQueue = [...updateQueue];
  updateQueue = [];

  const updatesByIndex = new Map<number, SetStateAction<any>[]>();

  currentQueue.forEach((update) => {
    if (!updatesByIndex.has(update.index)) {
      updatesByIndex.set(update.index, []);
    }
    updatesByIndex.get(update.index)?.push(update.action);
  });

  let shouldRender = false;

  updatesByIndex.forEach((actions, index) => {
    let nextState = states[index];

    for (const action of actions) {
      if (typeof action === "function") {
        nextState = action(nextState);
      } else {
        nextState = action;
      }
    }

    if (nextState !== states[index]) {
      states[index] = nextState;
      shouldRender = true;
    }
  });

  if (shouldRender && currentComponent && currentContainer) {
    render(currentComponent, currentContainer);
  }
};

const scheduleUpdate = () => {
  if (!isUpdateScheduled) {
    isUpdateScheduled = true;
    requestAnimationFrame(processUpdateQueue);
  }
};

export const useState = <T>(initialState: T): [T, Dispatch<SetStateAction<T>>] => {
  const index = hookIndex++;

  if (states[index] === undefined) {
    states[index] = typeof initialState === "function" ? initialState() : initialState;
  }

  const setState = (action: SetStateAction<T>) => {
    updateQueue.push({ index, action });
    scheduleUpdate();
  };

  return [states[index], setState];
};
