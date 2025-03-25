import { renderToDOM } from "../renderer/render";
import { JSXElement, SetStateAction, StateUpdate } from "../types";

const createUpdateScheduler = () => {
  const updateQueue: StateUpdate<unknown>[] = [];
  let isScheduled = false;

  return {
    extract: () => {
      const currentQueue = [...updateQueue];
      updateQueue.length = 0;
      return currentQueue;
    },
    push: (update: StateUpdate<unknown>) => {
      updateQueue.push(update);
    },
    schedule: (callback: () => void) => {
      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(() => {
          isScheduled = false;
          callback();
        });
      }
    },
  };
};

const createStateManager = () => {
  const states: any[] = [];
  let hookIndex = 0;

  return {
    resetIndex: () => {
      hookIndex = 0;
    },
    getNextIndex: () => hookIndex++,
    getState: (index: number) => states[index],
    setState: (index: number, value: any) => {
      states[index] = value;
    },
    initState: <T>(index: number, initialValue: T) => {
      if (states[index] === undefined) {
        states[index] = typeof initialValue === "function" ? initialValue() : initialValue;
      }
      return states[index];
    },
  };
};

const createComponentManager = () => {
  let currentComponent: (() => JSXElement) | null = null;
  let currentContainer: HTMLElement | null = null;

  return {
    setComponent: (component: () => JSXElement, container: HTMLElement) => {
      currentComponent = component;
      currentContainer = container;
    },
    render: () => {
      if (currentComponent && currentContainer) {
        currentContainer.innerHTML = "";
        renderToDOM(currentComponent(), currentContainer);
      }
    },
  };
};

export const updateScheduler = createUpdateScheduler();
export const stateManager = createStateManager();
export const componentManager = createComponentManager();

export const processUpdates = () => {
  const updates = updateScheduler.extract();
  const updatesByIndex = updates.reduce((map, update) => {
    const actions = map.get(update.index) || [];
    map.set(update.index, [...actions, update.action]);
    return map;
  }, new Map<number, SetStateAction<any>[]>());

  let shouldRender = false;
  updatesByIndex.forEach((actions, index) => {
    const nextState = actions.reduce((state, action) => {
      return typeof action === "function" ? (action as (prevState: any) => any)(state) : action;
    }, stateManager.getState(index));

    if (nextState !== stateManager.getState(index)) {
      stateManager.setState(index, nextState);
      shouldRender = true;
    }
  });

  if (shouldRender) {
    stateManager.resetIndex();
    componentManager.render();
  }
};
