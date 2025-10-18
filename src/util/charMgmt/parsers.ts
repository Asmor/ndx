import type { AbilityIcon, Die, GYRO } from "../../constants";
import type {
  Ability,
  AbilityEffect,
  AbilityType,
  Character,
  Power,
  Quality,
} from "./types";

export const errors = {
  sections: {
    empty: "Input is empty. [sections.empty]",
    duplicate: (secName: string) =>
      `Multiple '${secName}' sections found. There should be only one of each section. [sections.duplicate]]`,
    unknown: (secName: string) =>
      `Invalid section '${secName}. Sections are 'Powers', 'Qualities', 'Status', and 'Abilities'. [sections.unknown]`,
    missing: (secNames: string[]) =>
      `Missing the following sections: ${secNames.join(", ")}.  [sections.missing]`,
  },
  status: {
    format: (line: string) =>
      `Bad status: '${line}'. Status should be in the format 'Status d10, d8, d6'. Each die must be one of 4, 6, 8, 10, or 12. [status.format]`,
  },
  pq: {
    format: (line: string) =>
      `Bad power or quality: '${line}'. Powers and qualities should be in the format 'Power Name d10'. [pq.format]`,
  },
  die: {
    invalid: (die: string) =>
      `Invalid die size '${die}'. Only allowed sizes are 4, 6, 8, 10, or 12. [die.invalid]`,
  },
  ability: {
    format: (ability: string) =>
      `Bad ability definition: '${ability}'. Abilities must consist of exactly 2 or 3 parts separated by two colons ('::'). Examples: 'g:Principle of the Sea::o:x' or 'y:Telekinetic Assault::p:Telekinesis::a:x a:d a:n'. [ability.format]`,
    color: (colorName: string) =>
      `Bad color in '${colorName}'. Color must be one of 'g', 'y', 'r', 'o', followed by a colon and then the ability name. Example: 'y:Telekinetic Assault'. [ability.color]`,
    name: (s: string) =>
      `Bad name in '${s}'. Format should be e.g. 'g:Power Name'. [ability.name]`,
    pq: (s: string) =>
      `Can't figure out if '${s}' is a power or quality. Should be specified with 'p:' or 'q:', or '*' for a generic roll. Example: 'p:Telekinesis'. [ability.pq]`,
    icons: (s: string) =>
      `Bad icons for '${s}'. Should either be '-' or some combination of 'a', 'b', 'd', 'h', 'o', and/or 'r'. Examples: 'bh:d', '-:nd'. [ability.icons]`,
    ndx: (s: string) =>
      `Bad effect dice for '${s}'. Should be some combination of 'n' (min), 'd' (mid), and/or 'x' (max). Examples: 'bh:d', '-:nd'. [ability.ndx]'`,
    dupes: (names: string[]) =>
      `Each ability name must be unique. The following ability names are repeated: ${names.join(", ")}. [ability.dupes]`,
  },
};

const regex = {
  // Trims leading and trailing space from each line
  trim: /^\s*(.*?)\s*$/,
  trailingNewlines: /\n+$/,
  // Breaks into sections based on empty line breaks
  sections: /\n{2,}/,
  status: /^status[, ]+d?(\d+)[, ]+d?(\d+)[, ]+d?(\d+)$/i,
  pq: /^(.*?)\s+d?(\d+)$/,
  die: /^(4|6|8|10|12)$/,
  ability: {
    split: /::/,
    // ga:Ability Name
    // $1 = g|y|r|o
    // $2 = a|i|r or undef
    identity: /^([gyro])([air])?:/i,
    name: /:(.*)/,
    // p:Power Name
    // $1 = p|q or undef
    // $2 = "!" or undef
    // $3 = *? or undef
    pq: /^([pq])(?=(!)?:)|^(\*)$/i,
    rollSplit: /[\s,]+/,
    icons: /^(-|[abdhor]+):/i,
    ndx: /:([ndx]+)/i,
  },
};

export const trimLines = (text: string) => {
  const lines = text.split("\n");
  const trimmed = lines.map((line) => line.match(regex.trim)?.[1]);
  return trimmed.join("\n");
};

export const getSections = (text: string) => {
  const sections = text
    .split(regex.sections)
    .filter((sec) => sec)
    // if there's a single trailing new line at the end of the file it will be
    // kept as part of the last section
    .map((sec) => sec.replace(regex.trailingNewlines, ""));

  if (!sections.length) {
    throw new Error(errors.sections.empty);
  }

  return sections;
};

interface SectionsByType {
  identity: string;
  powers: string;
  qualities: string;
  status: string;
  abilities: string;
}
export const inferSectionTypes = (sections: string[]): SectionsByType => {
  const sectionsByType: Partial<SectionsByType> = {
    // identity section must always be first
    identity: sections[0],
  };

  // Copy the array but pull out the status section since it's more difficult to
  // match on
  const copy = sections.slice(1).filter((section) => {
    const isStatusSection = section.match(/^status/i);
    if (isStatusSection) insert("status", section);
    return !isStatusSection;
  });

  function insert(k: string, section: string) {
    const key = k as keyof SectionsByType;
    if (sectionsByType[key]) throw new Error(errors.sections.duplicate(key));
    sectionsByType[key] = section;
  }

  copy.forEach((section) => {
    // first line should be identifier
    const identifier = section.split("\n")[0].toLowerCase();

    switch (identifier) {
      case "powers":
        insert("powers", section);
        break;
      case "qualities":
        insert("qualities", section);
        break;
      case "abilities":
        insert("abilities", section);
        break;
      default:
        throw new Error(errors.sections.unknown(identifier));
    }
  });

  const missingSections = ["powers", "qualities", "status", "abilities"].filter(
    (key) => !sectionsByType[key as keyof SectionsByType]
  );

  if (missingSections.length) {
    throw new Error(errors.sections.missing(missingSections));
  }

  return sectionsByType as SectionsByType;
};

export const parseDie = (die: string) => {
  if (!die.match(regex.die)) throw new Error(errors.die.invalid(die));

  return Number.parseInt(die) as Die;
};

export const parsePQSection = <T extends Power | Quality>(
  type: "power" | "quality",
  section: string
) => {
  const lines = section.split("\n").slice(1);
  const powers: T[] = [];

  lines.forEach((line) => {
    const [, name, die] = line.match(regex.pq) ?? [];
    if (!name) throw new Error(errors.pq.format(line));

    powers.push({
      type,
      name,
      die: parseDie(die),
    } as T);
  });

  return powers;
};

export const parseStatus = (statusLine: string): Character["status"] => {
  const [, green, yellow, red] = statusLine.match(regex.status) ?? [];
  if (!green) throw new Error(errors.status.format(statusLine));

  return {
    green: parseDie(green),
    yellow: parseDie(yellow),
    red: parseDie(red),
  };
};

const colorCodeToName: Record<string, GYRO> = {
  g: "green",
  y: "yellow",
  r: "red",
  o: "out",
};

const effectCodeToName: Record<string, AbilityIcon> = {
  a: "attack",
  b: "boost",
  d: "defend",
  h: "hinder",
  o: "overcome",
  r: "recover",
};

// If the text matches the regex, returns the value of the first capture group.
// Otherwise, calls errFunc with the provided text
const getMatchOrThrow = (
  regex: RegExp,
  text: string,
  errFunc: (s: string) => string
) => {
  const [, ...val] = text.match(regex) ?? [];
  if (!val) throw new Error(errFunc(text));
  return val;
};

const basicActions = [
  "ga:Basic Attack::a:d",
  "ga:Basic Defend::d:d",
  "ga:Basic Boost::b:d",
  "ga:Basic Hinder::h:d",
  "ga:Basic Overcome::o:d",
];
// todo test
export const parseAbilitySection = (section: string) => {
  const abilities: Character["abilities"] = {
    green: [],
    yellow: [],
    red: [],
    out: [],
    basic: basicActions.map(parseAbility),
  };

  section
    .split("\n")
    .slice(1)
    .forEach((line) => {
      const ability = parseAbility(line);
      abilities[ability.color].push(ability);
    });

  return abilities;
};

// todo test
export const parseAbility = (abilityLine: string): Ability => {
  const parts = abilityLine
    .split(regex.ability.split)
    .map((part) => part.trim());
  // ["g:Psychic Assault", "p:Telekinesis", "a:d h:n"];
  if (parts.length < 2 || parts.length > 4) {
    throw new Error(errors.ability.format(abilityLine));
  }

  const identity = parts[0];
  // required power/quality is optional, but if present will always be second
  // and will always start with p or q. Effects will _never_ start with p  or q.
  const reqPq = parts[1].charAt(0).match(/[pq*]/) ? parts[1] : null;
  const effectsIndex = reqPq ? 2 : 1;
  const descriptionIndex = effectsIndex + 1;
  const rawEffectsString = parts[effectsIndex];
  const rawEffects =
    rawEffectsString === "-"
      ? []
      : rawEffectsString.split(regex.ability.rollSplit);
  const description = parts[descriptionIndex];

  const [color, type] = getMatchOrThrow(
    regex.ability.identity,
    identity,
    errors.ability.color
  );

  const [name] = getMatchOrThrow(
    regex.ability.name,
    identity,
    errors.ability.name
  );

  let required: Ability["required"] = undefined;
  let single: boolean | undefined;
  let generic: boolean | undefined;
  if (reqPq) {
    const [pq, isSingle, isGeneric] = getMatchOrThrow(
      regex.ability.pq,
      reqPq,
      errors.ability.pq
    );

    if (isGeneric) {
      single = true;
      generic = true;
    } else {
      const [pqName] = getMatchOrThrow(
        regex.ability.name,
        reqPq,
        errors.ability.name
      );
      required = {
        name: pqName,
        type: pq === "p" ? "power" : "quality",
      };
      if (isSingle) single = true;
    }
  }

  const effects: AbilityEffect[] = rawEffects.map((rawRoll) => {
    const [iconString] = getMatchOrThrow(
      regex.ability.icons,
      rawRoll,
      errors.ability.icons
    );

    const icons: AbilityIcon[] =
      iconString === "-"
        ? []
        : iconString.split("").map((c) => effectCodeToName[c]);

    const rawNdx = generic
      ? "d"
      : getMatchOrThrow(regex.ability.ndx, rawRoll, errors.ability.ndx);

    const ndx: Partial<Record<"n" | "d" | "x", boolean>> = {};
    ["n", "d", "x"].forEach((key) => {
      if (rawNdx.indexOf(key) > -1) ndx[key as "n" | "d" | "x"] = true;
    });

    return {
      icons,
      ndx,
    };
  });

  const noRoll = !effects.length;

  return {
    color: colorCodeToName[color],
    type: (type as AbilityType) || undefined,
    name,
    required,
    effects,
    single,
    generic,
    noRoll,
    description,
  };
};

// todo test
export const parseCharacter = (text: string): Character => {
  const sections = getSections(trimLines(text));
  const sectionsByType = inferSectionTypes(sections);
  const powers = parsePQSection<Power>("power", sectionsByType.powers);
  const qualities = parsePQSection<Quality>(
    "quality",
    sectionsByType.qualities
  );
  const status = parseStatus(sectionsByType.status);
  const abilities = parseAbilitySection(sectionsByType.abilities);

  const abilityNames = new Set<string>();
  const dupes = new Set<string>();
  [
    ...abilities.basic,
    ...abilities.green,
    ...abilities.yellow,
    ...abilities.red,
    ...abilities.out,
  ]
    .map((ability) => ability.name)
    .forEach((name) =>
      abilityNames.has(name) ? dupes.add(name) : abilityNames.add(name)
    );

  if (dupes.size) {
    throw new Error(errors.ability.dupes([...dupes]));
  }

  return {
    type: "character",
    ver: 1,
    name: sectionsByType.identity,
    powers,
    qualities,
    status,
    abilities,
  };
};
