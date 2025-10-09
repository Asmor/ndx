import type { GYRO } from "../../constants";
import colors from "../colors";
import type { Character, Power, Quality } from "./types";

export const nonePower: Power = {
  name: "(none)",
  die: 4,
  type: "power",
};

export const noneQuality: Quality = {
  name: "(none)",
  die: 4,
  type: "quality",
};

export const colorsByColor: Record<GYRO, string> = {
  green: colors.green,
  yellow: colors.yellow,
  red: colors.red,
  out: colors.fg,
};

export const BlankCharacter: Character = {
  name: "",
  ver: 1,
  type: "character",
  abilities: {
    green: [],
    yellow: [],
    red: [],
    out: [],
    basic: [],
  },
  powers: [],
  qualities: [],
  status: {
    green: 8,
    yellow: 8,
    red: 8,
  },
};
