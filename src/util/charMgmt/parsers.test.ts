import { describe, expect, test } from "vitest";
import {
  errors,
  getSections,
  inferSectionTypes,
  parseDie,
  parsePQSection,
  parseStatus,
  trimLines,
} from "./parsers";
import sampleCharacterText from "../../samples/cordelia.txt?raw";

const sampleCharacterSections = {
  identity: "Cordelia",
  powers: trimLines(
    `Powers
			Cosmic 10
			Mind Tentacles 8
			Telekinesis 10
			Remote Viewing 8
			Absorption 8`
  ),
  qualities: trimLines(
    `Qualities
			Self-Discipline 12
			Otherworldy Mythos 8
			Siren's Song 8`
  ),
  status: trimLines(`Status 6, 8, 10`),
  abilities: trimLines(
    `Abilities
      g:Psychic Assault::p:Telekinesis::a:d h:n::Attack using Telekineses. Hinder the target using your Min die.
      g:Psychic Coordination::p:Remote Viewing::b:d::Boost using Remote Viewing. Apply that bonus to all hero Attack and Overcome actions until the start of your next turn.
      g:Principle of Science::o:x::Overcome while applying specific scientific principles. Use your Max die. You and each of your allies gain a hero point.
      g:Principle of the Sea::o:x::Overcome a situation while underwater and use your Max die. You and each of your allies gain a hero point.
      y:Encourage::p:Cosmic::a:d b:n::Attack using Cosmic. Boost all nearby heroes taking Attack or Overcome actions using your Min die until your next turn.
      y:Mass Effect::p:Mind Tentacles::bh:d::Boost or Hinder using Mind Tentacles and apply that mod to multiple close targets.
      y:Astral Projection::p:Remote Viewing::o:nx::Overcome using Remote Viewing and use your Max+Min dice. You do not have to be physically present in the area you are Overcoming.
      y:Telekinetic Assault::p:Telekinesis::a:x a:d a:n::Attack using Telekinesis. Either Attack one target and use your Max die, or two targets and use your Mid die against one and your Min die against another.
      r:Defensive Deflection::p!:Absorption::ad:d::When you would be dealt damage, you may roll your single Absorption die as a Defend against that damage and as an Attack against a nearby target other than the source of that damage.
      r:Summoned Allies::p:Mind Tentacles::-:d::Use Mind Tentacles to create a number of d6 minions equal to your Mid die. Choose the one same basic action that they each perform. They all act at the start of your turn.
      r:Powerful Strike::p:Cosmic::a:dx::Attack using Cosmic. Use your Max+Mid dice.`
  ),
};

describe("Parsers", () => {
  describe("trim", () => {
    test("Trims leading and trailing spaces", () => {
      const text = "  a  \nb\n\n  c\n d e f    g";
      const expected = "a\nb\n\nc\nd e f    g";
      expect(trimLines(text)).toEqual(expected);
    });
  });

  describe("getSections", () => {
    test("Throws if input is blank", () => {
      const blank = "";
      const justBlankLines = "\n\n\n\n";
      expect(() => getSections(blank)).toThrowError(errors.sections.empty);
      expect(() => getSections(justBlankLines)).toThrowError(
        errors.sections.empty
      );
    });

    test("Returns sections separated by one or more blank lines", () => {
      const text = "\n\na\naa\na\n\nb\n\nc  c		c\nc\n\nd\n\n";
      const expected = ["a\naa\na", "b", "c  c		c\nc", "d"];
      expect(getSections(text)).toEqual(expected);
    });

    test("Splits sample character correctly", () => {
      expect(getSections(sampleCharacterText)).toEqual([
        sampleCharacterSections.identity,
        sampleCharacterSections.powers,
        sampleCharacterSections.qualities,
        sampleCharacterSections.status,
        sampleCharacterSections.abilities,
      ]);
    });
  });

  describe("inferSectionTypes", () => {
    test("Maps sections correctly", () => {
      const sections = getSections(sampleCharacterText);
      expect(inferSectionTypes(sections)).toStrictEqual({
        identity: sampleCharacterSections.identity,
        powers: sampleCharacterSections.powers,
        qualities: sampleCharacterSections.qualities,
        status: sampleCharacterSections.status,
        abilities: sampleCharacterSections.abilities,
      });
    });
    test("Throws on duplicate section", () => {
      const sections = [
        sampleCharacterSections.identity,
        sampleCharacterSections.powers,
        sampleCharacterSections.qualities,
        sampleCharacterSections.status,
        sampleCharacterSections.powers,
        sampleCharacterSections.abilities,
      ];
      expect(() => inferSectionTypes(sections)).toThrowError(
        errors.sections.duplicate("powers")
      );
    });

    test("Throws on bad/unknown section", () => {
      const sections = [
        sampleCharacterSections.identity,
        sampleCharacterSections.powers,
        sampleCharacterSections.qualities,
        sampleCharacterSections.status,
        sampleCharacterSections.abilities,
        `badsection`,
      ];
      expect(() => inferSectionTypes(sections)).toThrowError(
        errors.sections.unknown("badsection")
      );
    });

    test("Throws on missing sections", () => {
      const sections = [
        sampleCharacterSections.identity,
        sampleCharacterSections.qualities,
        sampleCharacterSections.abilities,
      ];
      expect(() => inferSectionTypes(sections)).toThrowError(
        errors.sections.missing(["powers", "status"])
      );
    });
  });

  describe("parseDie", () => {
    test("Parses dice correctly", () => {
      expect(parseDie("4")).toBe(4);
      expect(parseDie("6")).toBe(6);
      expect(parseDie("8")).toBe(8);
      expect(parseDie("10")).toBe(10);
      expect(parseDie("12")).toBe(12);
    });

    test("Throws on bad die dize", () => {
      expect(() => parseDie("666")).toThrowError(errors.die.invalid("666"));
    });
  });

  describe("parsePQSection", () => {
    test("Parses powers correctly", () => {
      const goodPowers = trimLines(
        `Powers
				Cosmic    10
				Mind Tentacles d8`
      );
      expect(parsePQSection("power", goodPowers)).toStrictEqual([
        { die: 10, name: "Cosmic", type: "power" },
        { die: 8, name: "Mind Tentacles", type: "power" },
      ]);
    });
    test("Parses qualities correctly", () => {
      const goodPowers = trimLines(
        `Qualities
				Self-Discipline 12
				Otherworldy Mythos 8`
      );
      expect(parsePQSection("quality", goodPowers)).toStrictEqual([
        { die: 12, name: "Self-Discipline", type: "quality" },
        { die: 8, name: "Otherworldy Mythos", type: "quality" },
      ]);
    });
    test("Throws on bad power or quality definition", () => {
      const badPowers = trimLines(
        `Powers
				Cosmic    10
				Mind Tentacles`
      );

      expect(() => parsePQSection("power", badPowers)).toThrowError(
        errors.pq.format("Mind Tentacles")
      );
    });
  });

  describe("parseStatus", () => {
    test("Parses status correctly", () => {
      expect(parseStatus("Status 6, 8, 10")).toStrictEqual({
        green: 6,
        yellow: 8,
        red: 10,
      });
      expect(parseStatus("status d6, 8, d12")).toStrictEqual({
        green: 6,
        yellow: 8,
        red: 12,
      });
    });

    test("Throws on bad format", () => {
      const one = "status 6";
      const two = "status 6 6";
      const four = "status 6 6 6 6"; // three, sir!
      expect(() => parseStatus(one)).toThrowError(errors.status.format(one));
      expect(() => parseStatus(two)).toThrowError(errors.status.format(two));
      expect(() => parseStatus(four)).toThrowError(errors.status.format(four));
    });
  });

  describe.todo("parseAbility", () => {});
  describe.todo("parseCharacter", () => {});
});
