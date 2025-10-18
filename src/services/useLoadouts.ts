import { atom, useAtom, useSetAtom } from "jotai";
import sampleCharacterText from "../samples/cordelia.txt?raw";
import { parseCharacter } from "../util/charMgmt/parsers";
import { useCallback, useEffect } from "react";
import type { Loadout, LoadoutDict } from "../util/charMgmt/types";
import { getLoadouts, setLoadout } from "../util/storage/loadouts";
import { BlankCharacter } from "../util/charMgmt/misc";
import { getDefinition } from "../util/charMgmt/getDefinition";

const cordelia = parseCharacter(sampleCharacterText);

const statusAtom = atom("Green");
const characterAtom = atom<Loadout>(BlankCharacter);

const showEditorAtom = atom(false);
const loadsoutAtom = atom<LoadoutDict>();
const initializedAtom = atom(false);

// todo populate atoms with async functions now that I have suspense setup
// also, show a loading indicator?

const useLoadouts = () => {
  const [status, setStatus] = useAtom(statusAtom);
  const [currentLoadout, setCurrentLoadout] = useAtom(characterAtom);
  const [showEditor, setShowEditor] = useAtom(showEditorAtom);
  const setLoadouts = useSetAtom(loadsoutAtom);
  const [initialized, setInitialized] = useAtom(initializedAtom);

  useEffect(() => {
    // todo find a better way of handling this.
    if (initialized) return;
    setInitialized(true);
    (async () => {
      const storedLoadouts = await getLoadouts();

      setLoadouts(storedLoadouts);
      // todo remember which loadout was last selected
      const initialChar = Object.values(storedLoadouts)[0] ?? cordelia;
      setCurrentLoadout(initialChar);
    })();
  }, [initialized, setCurrentLoadout, setInitialized, setLoadouts]);

  const getStatusDie = () => {
    if (status === "Out")
      throw new Error("Can't get status die for an Out character.");

    switch (status) {
      case "Green":
        return cordelia.status.green;
      case "Yellow":
        return cordelia.status.yellow;
      case "Red":
        return cordelia.status.red;
      default:
        throw new Error("Can't get status die for an Out character.");
    }
  };

  const updateLoadout = (loadout: Loadout) => {
    setLoadout(loadout);
    setCurrentLoadout(loadout);
  };

  const getRaw = useCallback(
    () => getDefinition(currentLoadout),
    [currentLoadout]
  );
  const getCurrentLoadout = useCallback(() => currentLoadout, [currentLoadout]);
  const getSampleText = useCallback(() => sampleCharacterText, []);

  return {
    getCurrentLoadout,
    status,
    setStatus,
    getStatusDie,
    getRaw,
    updateLoadout,
    showEditor,
    setShowEditor,
    getSampleText,
  };
};

export default useLoadouts;
