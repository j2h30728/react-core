import { renderToDOM } from "./render";
import { Dispatch, JSXElement, SetStateAction, StateUpdate } from "./types";

const createUpdateScheduler = () => {
  const updateQueue: StateUpdate[] = [];
  let isScheduled = false;

  return {
    extract: () => {
      const currentQueue = [...updateQueue];
      updateQueue.length = 0;
      return currentQueue;
    },
    push: (update: StateUpdate) => {
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

const createCore = () => {
  const updateScheduler = createUpdateScheduler();
  const stateManager = createStateManager();
  const componentManager = createComponentManager();

  const processUpdates = () => {
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

  const render = (component: () => JSXElement, container: HTMLElement) => {
    componentManager.setComponent(component, container);
    stateManager.resetIndex();
    componentManager.render();
  };

  const useState = <T>(initialState: T): [T, Dispatch<SetStateAction<T>>] => {
    const index = stateManager.getNextIndex();
    const state = stateManager.initState(index, initialState);

    const setState = (action: SetStateAction<T>) => {
      updateScheduler.push({ index, action });
      updateScheduler.schedule(processUpdates);
    };

    return [state, setState];
  };
  return {
    render,
    useState,
  };
};

export const { render, useState } = createCore();
