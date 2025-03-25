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
