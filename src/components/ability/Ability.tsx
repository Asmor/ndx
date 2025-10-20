import styled from "styled-components";
import {
  abilityTypeToString,
  isCharacter,
  type AbilityResult,
  type AbilityResultFull,
  type AbilityResultSingle,
  type Ability as AbilityType,
  type Character,
  type Power,
  type Quality,
} from "../../util/charMgmt/types";
import colors from "../../util/colors";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import useLoadouts from "../../services/useLoadouts";
import {
  colorsByColor,
  nonePower,
  noneQuality,
} from "../../util/charMgmt/misc";
import PqSelector from "./PqSelector";
import Button from "../common/Button";
import { rollDice, rollDie } from "../../util/dice";
import useHistory from "../../services/useHistory";
import { getUsedIcons } from "../../util/ability";
import IconImg from "../common/IconImg";
import { Dices } from "lucide-react";
import { allDice, DNotationToDie, type DNotation } from "../../constants";
import { highlightText } from "../../util/strings";
import AbilityEffect from "./AbilityEffect";

const iconSize = 24;

interface AbContProps {
  $ab: AbilityType;
}
const AbCont = styled.div<AbContProps>`
  border-left: 8px solid ${(p) => colorsByColor[p.$ab.color]};
  padding: 8px;
  display: grid;
  grid-template-areas:
    "icons name button"
    "selectors selectors selectors"
    "desc desc desc";
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;

  &:not(:first-child) {
    border-top: 1px solid ${colors.neutral};
  }
`;

const AbName = styled.div`
  grid-area: name;
  height: ${iconSize}px;
  display: flex;
  justify-content: start;
  align-items: center;
  font-weight: bold;
`;

const AbIcons = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  width: ${iconSize * 2 + 4}px;
  justify-content: center;
  grid-area: icons;
`;

const AbSelectors = styled.div`
  grid-area: selectors;
  display: flex;
  gap: 8px;
  justify-content: space-around;
`;

const AbButton = styled.div`
  grid-area: button;
  display: flex;
  align-items: center;
`;

const AbDesc = styled.div`
  grid-area: desc;
  padding: 8px;
`;

const Description = styled.span`
  font-style: italic;
`;

const Type = styled.span`
  font-weight: bold;
  font-variant: small-caps;
  font-size: 0.9rem;
  margin-right: 8px;
`;

const SelectorPlaceholder = styled.div`
  flex: 1 1 0;
  min-width: 0%;
`;

const DieButton = styled(Button)`
  flex: 0 0 52px;
`;

const PreviewInfo = styled.div`
  flex-grow: 1;
  padding: 0 8px;
`;

const PreviewEffects = styled.div`
  display: flex;
  justify-content: right;
  gap: 8px;
`;

interface AbilityProps {
  ability: AbilityType;
  preview?: boolean;
}
const Ability = ({ ability, preview }: AbilityProps) => {
  const { addAbilityResult } = useHistory();
  const { status, getStatusDie, getCurrentLoadout } = useLoadouts();
  const char = getCurrentLoadout();

  if (!isCharacter(char)) {
    // todo probably need to fix this in the future
    throw "Can't get abilities from non-characters";
  }

  const [selectedPower, setSelectedPower] = useState<Power>(
    getInitialPower(ability, char)
  );
  const [selectedQuality, setSelectedQuality] = useState<Quality>(
    getInitialQuality(ability, char)
  );

  const iconImgs = useMemo(() => {
    return getUsedIcons(ability).map((icon, index) => (
      <IconImg key={index} size={iconSize} icon={icon} fixedWidth={true} />
    ));
  }, [ability]);

  const powerSelector = useMemo(() => {
    if (ability.single && ability.required?.type !== "power")
      return <SelectorPlaceholder />;
    const isLocked = ability.required?.type === "power";
    return (
      <PqSelector
        locked={isLocked}
        pqList={char.powers}
        selected={selectedPower}
        noneOption={nonePower}
        handleChange={setSelectedPower}
      />
    );
  }, [char, ability, selectedPower]);

  const qualitySelector = useMemo(() => {
    if (ability.single && ability.required?.type !== "quality")
      return <SelectorPlaceholder />;
    const isLocked = ability.required?.type === "quality";
    return (
      <PqSelector
        locked={isLocked}
        pqList={char.qualities}
        selected={selectedQuality}
        noneOption={noneQuality}
        handleChange={setSelectedQuality}
      />
    );
  }, [char, ability, selectedQuality]);

  const handleRollFull = useCallback(() => {
    const statusDie = getStatusDie();
    const dice = [selectedPower.die, selectedQuality.die, getStatusDie()];
    const [min, mid, max] = rollDice(...dice);
    const result: AbilityResultFull = {
      char,
      ability,
      roll: { min, mid, max },
      rolled: {
        power: selectedPower,
        quality: selectedQuality,
        status: { name: status, die: statusDie },
      },
    };

    addAbilityResult(result);
  }, [
    getStatusDie,
    selectedPower,
    selectedQuality,
    char,
    ability,
    status,
    addAbilityResult,
  ]);

  const handleRollSingle = useCallback(() => {
    let die: number;
    const rolled: AbilityResult["rolled"] = {};
    if (ability.required?.type === "power") {
      die = selectedPower.die;
      rolled.power = selectedPower;
    } else {
      die = selectedQuality.die;
      rolled.quality = selectedQuality;
    }

    const result: AbilityResultSingle = {
      char,
      ability,
      roll: rollDie(die),
      rolled,
    };
    addAbilityResult(result);
  }, [selectedPower, selectedQuality, char, ability, addAbilityResult]);

  const handleRollGeneric = useCallback(
    (dN: DNotation) => {
      const die = DNotationToDie[dN];

      const result: AbilityResultSingle = {
        char,
        ability,
        roll: rollDie(die),
        rolled: { generic: { die, name: dN } },
      };
      addAbilityResult(result);
    },
    [ability, addAbilityResult, char]
  );

  const handleRoll = useCallback(() => {
    if (ability.single) handleRollSingle();
    else handleRollFull();
  }, [handleRollFull, handleRollSingle, ability]);

  const selectors = useMemo(() => {
    if (preview) {
      if (ability.generic) return <PreviewInfo>Generic roll</PreviewInfo>;
      if (!ability.required) return null;
      return (
        <PreviewInfo>
          {highlightText({
            text: `Requires ${ability.required.name} (${ability.required.type})`,
            phrase: ability.required.name,
          })}
        </PreviewInfo>
      );
    }

    if (ability.noRoll) return null;

    if (ability.generic) {
      return allDice.map((die) => (
        <DieButton key={die} onClick={() => handleRollGeneric(die)}>
          <IconImg icon={die} size={24} />
        </DieButton>
      ));
    }

    return (
      <>
        {powerSelector}
        {qualitySelector}
      </>
    );
  }, [ability, powerSelector, qualitySelector, handleRollGeneric, preview]);

  const description = useMemo(() => {
    const parts: ReactNode[] = [];

    if (ability.type) {
      parts.push(<Type key="type">{abilityTypeToString[ability.type]}.</Type>);
    }

    if (ability.description) {
      const descriptionText = ability.required?.name
        ? highlightText({
            text: ability.description,
            phrase: ability.required.name,
          })
        : ability.description;
      parts.push(
        <Description key="description">{descriptionText}</Description>
      );
    }

    if (!parts.length) return null;
    return parts;
  }, [ability]);

  const rollArea = useMemo(() => {
    if (preview) {
      if (!ability.effects.length) return null;
      return (
        <PreviewEffects>
          {ability.effects.map((effect, index) => (
            <AbilityEffect effect={effect} key={index} />
          ))}
        </PreviewEffects>
      );
    }

    if (ability.generic || ability.noRoll) {
      return null;
    }

    return (
      <Button onClick={handleRoll}>
        <Dices />
      </Button>
    );
  }, [ability, handleRoll, preview]);

  return (
    <AbCont $ab={ability}>
      <AbName>{ability.name}</AbName>
      {!!iconImgs.length && <AbIcons>{iconImgs}</AbIcons>}
      <AbSelectors>{selectors}</AbSelectors>
      <AbButton>{rollArea}</AbButton>
      {description && <AbDesc>{description}</AbDesc>}
    </AbCont>
  );
};

const getInitialPower = (ability: AbilityType, char: Character): Power => {
  if (!ability.required || ability.required.type !== "power") return nonePower;
  const pow = char.powers.find((p) => p.name === ability.required?.name);

  if (!pow) {
    console.error(
      `Can't find power '${ability.required.name}' referenced in ability '${ability.name}'`
    );
  }

  return {
    name: ability.required.name,
    type: "power",
    die: (pow || nonePower).die,
  };
};

const getInitialQuality = (ability: AbilityType, char: Character): Quality => {
  if (!ability.required || ability.required.type !== "quality")
    return noneQuality;
  const qual = char.qualities.find((q) => q.name === ability.required?.name);

  if (!qual) {
    console.error(
      `Can't find quality '${ability.required.name}' referenced in ability '${ability.name}'`
    );
  }

  return {
    name: ability.required.name,
    type: "quality",
    die: (qual || noneQuality).die,
  };
};

export default Ability;
