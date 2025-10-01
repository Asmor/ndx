import { atom, useAtom } from "jotai";
import sampleCharacterText from "../samples/cordelia.txt?raw";
import { parseCharacter } from "../util/charMgmt/parsers";
import { useCallback, useEffect } from "react";
import type { Character } from "../util/charMgmt/types";
import storage from "../util/storage";

const cordelia = parseCharacter(sampleCharacterText);

const statusAtom = atom("Green");
const characterAtom = atom({
  raw: sampleCharacterText,
  parsed: cordelia,
});

const showEditorAtom = atom(false);

const useCharacters = () => {
  const [status, setStatus] = useAtom(statusAtom);
  const [char, setChar] = useAtom(characterAtom);
  const [showEditor, setShowEditor] = useAtom(showEditorAtom);

  useEffect(() => {
    (async () => {
      const key = storage.keys.char;
      const storedCharacter = await storage.get(key);
      if (storedCharacter === null) {
        await storage.set(key, sampleCharacterText);
      } else {
        try {
          const parsed = parseCharacter(storedCharacter);
          setChar({ raw: storedCharacter, parsed });
        } catch (ex) {
          console.error("Error loading stored character", ex);
        }
      }
    })();
  }, [setChar]);

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

  const updateChar = (raw: string, parsed: Character) => {
    setChar({ raw, parsed });
    storage.set(storage.keys.char, raw);
  };

  const getRaw = useCallback(() => char.raw, [char]);
  const getCurrentCharacter = useCallback(() => char.parsed, [char]);
  const getSampleText = useCallback(() => sampleCharacterText, []);

  return {
    getCurrentCharacter,
    status,
    setStatus,
    getStatusDie,
    getRaw,
    updateChar,
    showEditor,
    setShowEditor,
    getSampleText,
  };
};

export default useCharacters;
