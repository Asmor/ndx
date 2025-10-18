import type {
  AbilityIcon,
  Die,
  GYRO,
  MinMidMax,
  NDX,
  PQ,
} from "../../constants";

export interface PowerQuality {
  type: PQ;
  name: string;
  die: Die;
}
export type Power = PowerQuality & { type: "power" };
export type Quality = PowerQuality & { type: "quality" };

export interface AbilityEffect {
  icons: AbilityIcon[];
  ndx: NDX;
}

export interface Ability {
  color: GYRO;
  name: string;
  description?: string;
  required?: Omit<PowerQuality, "die">;
  effects: AbilityEffect[];
  single?: boolean;
  generic?: boolean;
}

export type LoadoutType = "character";
export type LoadoutDict = Record<string, Loadout>;
export interface Loadout {
  type: LoadoutType;
  name: string;
  ver: number;
}

export interface Character extends Loadout {
  type: "character";
  name: string;
  status: {
    green: Die;
    yellow: Die;
    red: Die;
  };
  powers: Power[];
  qualities: Quality[];
  abilities: Record<GYRO | "basic", Ability[]>;
}

export const isCharacter = (val: Loadout): val is Character => {
  return val.type === "character";
};

export interface AbilityResultBase {
  char: Character;
  ability: Ability;
  rolled: {
    power?: Power;
    quality?: Quality;
    status?: { name: string; die: number };
    generic?: { name: string; die: number };
  };
}

export interface AbilityResultFull extends AbilityResultBase {
  roll: MinMidMax;
}

export interface AbilityResultSingle extends AbilityResultBase {
  roll: number;
}

export type AbilityResult = AbilityResultFull | AbilityResultSingle;

export type AbilityResultRoll = AbilityResult["roll"];

export const isSingleResult = (
  result: AbilityResult
): result is AbilityResultSingle => {
  return typeof result.roll === "number";
};

export const isFullResult = (
  result: AbilityResult
): result is AbilityResultFull => {
  return typeof result.roll !== "number";
};
