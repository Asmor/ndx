import { useCallback } from "react";
import { atom, useAtom } from "jotai";
import type { AbilityResult } from "../util/charMgmt/types";

interface AbilityResultHistory {
  timestamp: Date;
  result: AbilityResult;
  id: number;
}

const abilityResultHistoryAtom = atom<AbilityResultHistory[]>([]);
const historyIdAtom = atom(0);

const useHistory = () => {
  const [resultHistory, setResultHistory] = useAtom(abilityResultHistoryAtom);
  const [id, setId] = useAtom(historyIdAtom);

  const addAbilityResult = useCallback(
    (result: AbilityResult) => {
      const newEntry: AbilityResultHistory = {
        result,
        timestamp: new Date(),
        id,
      };
      setResultHistory([...resultHistory, newEntry]);
      setId(id + 1);
    },
    [resultHistory, setResultHistory, id, setId]
  );

  return {
    resultHistory,
    addAbilityResult,
  };
};

export default useHistory;
