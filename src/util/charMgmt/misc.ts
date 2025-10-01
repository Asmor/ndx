import type { GYRO } from "../../constants";
import colors from "../colors";
import type { Power, Quality } from "./types";

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
