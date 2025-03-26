import { renderToDOM } from "../renderer/render";
import { Container, JSXElement, SetStateAction, StateUpdate } from "../types";

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

const createRenderManager = () => {
  let rootComponent: (() => JSXElement) | null = null;
  let rootContainer: Container | null = null;

  const render = (component: (() => JSXElement) | null = null, container: Container | null = null) => {
    if (component && container) {
      rootComponent = component;
      rootContainer = container;
    }

    if (!rootComponent || !rootContainer) {
      return;
    }
    stateManager.resetIndex();
    const nextVDOM = rootComponent();
    renderToDOM(nextVDOM, rootContainer);
  };

  return {
    mount: (component: () => JSXElement, container: Container) => {
      render(component, container);
    },
    update: () => {
      render();
    },
  };
};

export const updateScheduler = createUpdateScheduler();
export const stateManager = createStateManager();
export const renderManager = createRenderManager();

export const processUpdates = () => {
  const updates = updateScheduler.extract();
  if (updates.length === 0) return;

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
    renderManager.update();
  }
};

export const render = (component: () => JSXElement, container: Container) => {
  renderManager.mount(component, container);
};
