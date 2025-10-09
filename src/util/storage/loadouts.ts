import type { Loadout, LoadoutDict } from "../charMgmt/types";
import storage from "./storage";

const key = "ndx:loadouts";

export const getLoadouts = async (): Promise<LoadoutDict> => {
  const loadouts = (await storage.get<LoadoutDict>(key)) || {};
  return Promise.resolve(loadouts);
};

export const setLoadout = async (l: Loadout) => {
  const loadoutKey = l.name;
  const originalLoadouts = await getLoadouts();
  const updatedLoadouts = {
    ...originalLoadouts,
    [loadoutKey]: l,
  };
  await storage.set(key, updatedLoadouts);
};
