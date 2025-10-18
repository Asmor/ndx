import type React from "react";

export type PQ = "power" | "quality";

export type GYRO = "green" | "yellow" | "red" | "out";

export type AbilityIcon =
  | "attack"
  | "boost"
  | "defend"
  | "hinder"
  | "overcome"
  | "recover"
  | "none";

export interface NDX {
  n?: boolean;
  d?: boolean;
  x?: boolean;
}

export const allNDX: NDX = { n: true, d: true, x: true };

export type Die = 4 | 6 | 8 | 10 | 12;

export type DNotation = "d4" | "d6" | "d8" | "d10" | "d12";

export interface MinMidMax {
  min: number;
  mid: number;
  max: number;
}

export interface ChildProps {
  children?: React.ReactNode | React.ReactNode[];
}
