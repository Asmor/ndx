import { atom, useAtom, useSetAtom } from "jotai";
import sampleCharacterText from "../samples/cordelia.txt?raw";
import { parseCharacter } from "../util/charMgmt/parsers";
import { useCallback, useEffect } from "react";
import type { Loadout, LoadoutDict } from "../util/charMgmt/types";
import { getLoadouts, setLoadout } from "../util/storage/loadouts";
import { BlankCharacter } from "../util/charMgmt/misc";
import { getDefinition } from "../util/charMgmt/getDefinition";
import LZString from "lz-string";

const cordelia = parseCharacter(sampleCharacterText);

const statusAtom = atom("Green");
const characterAtom = atom<Loadout>(BlankCharacter);

const showEditorAtom = atom(false);
const loadsoutAtom = atom<LoadoutDict>();

// Ensures that code a function is run exactly once.
export const loadoutsInitStatusAtom = atom<"pending" | "done">("pending");
export const runLoadoutsInitAtom = atom(
  (get) => get(loadoutsInitStatusAtom),
  async (get, set, initFn: () => Promise<void>) => {
    if (get(loadoutsInitStatusAtom) === "done") return;
    set(loadoutsInitStatusAtom, "done");
    await initFn();
  }
);

// todo populate atoms with async functions now that I have suspense setup
// also, show a loading indicator?

const useLoadouts = () => {
  const [status, setStatus] = useAtom(statusAtom);
  const [currentLoadout, setCurrentLoadout] = useAtom(characterAtom);
  const [showEditor, setShowEditor] = useAtom(showEditorAtom);
  const setLoadouts = useSetAtom(loadsoutAtom);
  const runInitOnce = useSetAtom(runLoadoutsInitAtom);

  useEffect(() => {
    runInitOnce(async () => {
      if (document.location.search.match(/\?character=/)) {
        try {
          const [, encoded] = document.location.search.split("=");
          const decoded = LZString.decompressFromEncodedURIComponent(encoded);
          const sharedChar = parseCharacter(decoded);
          setCurrentLoadout(sharedChar);
          setLoadout(sharedChar);
          history.replaceState(null, "", document.location.pathname);
          return;
        } catch (ex) {
          const [, encoded] = document.location.search.split("=");
          const decoded = LZString.decompressFromEncodedURIComponent(encoded);
          console.warn("Failed to load shared character", {
            ex,
            encoded,
            decoded,
          });
        }
      }

      const storedLoadouts = await getLoadouts();

      setLoadouts(storedLoadouts);
      // todo remember which loadout was last selected
      const initialChar = Object.values(storedLoadouts)[0] ?? cordelia;
      setCurrentLoadout(initialChar);
    });
  }, [runInitOnce, setCurrentLoadout, setLoadouts]);

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
