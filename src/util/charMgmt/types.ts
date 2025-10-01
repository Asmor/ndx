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
}

export interface Character {
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

export interface AbilityResult {
  char: Character;
  roll: MinMidMax;
  ability: Ability;
  rolled: {
    power?: Power;
    quality?: Quality;
    status?: { name: string; die: number };
  };
}
