import { BlankCharacter } from "../charMgmt/misc";
import JSONDX from "./jsondx";

let debugLoop = 0;
const storage = {
  get: async <T>(key: string): Promise<T | null> => {
    if (debugLoop > 20) return Promise.resolve(BlankCharacter as T);
    debugLoop++;
    const stored = localStorage.getItem(key);
    try {
      const result = JSONDX.parse<T>(stored);
      return Promise.resolve(result);
    } catch (ex) {
      console.error(`Couldn't parse ${key} from local storage:`, {
        stored,
        error: ex,
      });
      return null;
    }
  },

  set: async (key: string, value: unknown): Promise<void> => {
    const encodedValue = JSONDX.stringify(value);
    localStorage.setItem(key, encodedValue);
    return Promise.resolve();
  },
};

export default storage;
