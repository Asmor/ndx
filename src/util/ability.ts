import type { AbilityIcon } from "../constants";
import type { Ability } from "./charMgmt/types";

export const getUsedIcons = (ability: Ability) => {
  const usedIcons: Record<AbilityIcon, boolean> = {
    attack: false,
    boost: false,
    defend: false,
    hinder: false,
    overcome: false,
    recover: false,
    none: false,
  };

  Object.keys(usedIcons).forEach((k) => {
    const key = k as AbilityIcon;
    usedIcons[key] = ability.effects.some((roll) => roll.icons.includes(key));
  });

  return Object.keys(usedIcons)
    .filter((key) => usedIcons[key as AbilityIcon])
    .sort() as AbilityIcon[];
};
