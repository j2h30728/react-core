import { Dispatch, SetStateAction } from "custom-jsx-library/types";
import { processUpdates, stateManager, updateScheduler } from ".";

export const useState = <T>(initialState: T): [T, Dispatch<SetStateAction<T>>] => {
  const index = stateManager.getNextIndex();
  const state = stateManager.initState(index, initialState);

  const setState = (action: SetStateAction<T>) => {
    updateScheduler.push({ index, action });
    updateScheduler.schedule(processUpdates);
  };

  return [state, setState];
};

const argsChanged = (oldArgs: unknown[], newArgs: unknown[]) => {
  return !oldArgs || oldArgs.length !== newArgs.length || newArgs.some((arg, index) => arg !== oldArgs[index]);
};

export const useEffect = (callback: () => void, arg: unknown[]) => {
  const currentIndex = stateManager.getNextIndex();
  const effectState = stateManager.getState(currentIndex);

  if (!effectState || argsChanged(effectState, arg)) {
    stateManager.setState(currentIndex, arg);
    callback();
  }

  return () => {
    stateManager.setState(currentIndex, undefined);
  };
};
