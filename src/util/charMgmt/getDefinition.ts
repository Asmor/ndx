import type { AbilityIcon, GYRO } from "../../constants";
import {
  isCharacter,
  type Ability,
  type Character,
  type Loadout,
  type PowerQuality,
} from "./types";

const stringifyPqs = (pqs: PowerQuality[]) => {
  return pqs.map((pq) => `${pq.name} d${pq.die}`);
};

const colorsToCode: Record<GYRO, string> = {
  green: "g",
  yellow: "y",
  red: "r",
  out: "o",
};
const iconsToCode: Record<AbilityIcon, string> = {
  attack: "a",
  boost: "b",
  defend: "d",
  hinder: "h",
  overcome: "o",
  recover: "r",
  none: "-",
};
const stringifyAbility = (a: Ability) => {
  const sections = [`${colorsToCode[a.color]}${a.type ?? ""}:${a.name}`];

  if (a.required) {
    const r = a.required;
    const requiredParts = [r.type === "power" ? "p" : "q"];
    if (a.single) requiredParts.push("!");
    requiredParts.push(":", r.name);
    sections.push(requiredParts.join(""));
  } else if (a.generic) {
    sections.push("*");
  }

  const effectDef = a.noRoll
    ? "-"
    : a.effects
        .map((e) => {
          const icons = e.icons.length
            ? e.icons.map((icon) => iconsToCode[icon]).join("")
            : iconsToCode.none;
          const dice = Object.keys(e.ndx)
            .filter((set) => set)
            .join("");
          return `${icons}:${dice}`;
        })
        .join(", ");

  sections.push(effectDef);

  if (a.description) sections.push(a.description);

  return sections.join(" :: ");
};
const stringifyAbilities = (c: Character) => {
  const abilities = [
    ...c.abilities.green,
    ...c.abilities.yellow,
    ...c.abilities.red,
    ...c.abilities.out,
  ];
  return abilities.map(stringifyAbility);
};

const getCharacterDefinition = (c: Character): string => {
  const status = `Status d${c.status.green} d${c.status.yellow} d${c.status.red}`;
  const powers = ["Powers", ...stringifyPqs(c.powers)].join("\n\t");
  const qualities = ["Qualities", ...stringifyPqs(c.qualities)].join("\n\t");
  const abilities = ["Abilities", ...stringifyAbilities(c)].join("\n\t");

  return `${c.name}

${status}

${powers}

${qualities}

${abilities}
`;
};

export const getDefinition = (loadout: Loadout): string => {
  if (isCharacter(loadout)) return getCharacterDefinition(loadout);
  return "";
};
