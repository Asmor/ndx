import styled from "styled-components";
import {
  isCharacter,
  type AbilityResult,
  type Ability as AbilityType,
  type Character,
  type Power,
  type Quality,
} from "../../util/charMgmt/types";
import colors from "../../util/colors";
import { useCallback, useMemo, useState } from "react";
import useLoadouts from "../../services/useLoadouts";
import {
  colorsByColor,
  nonePower,
  noneQuality,
} from "../../util/charMgmt/misc";
import PqSelector from "./PqSelector";
import Button from "../common/Button";
import { rollDice } from "../../util/dice";
import useHistory from "../../services/useHistory";
import { getUsedIcons } from "../../util/ability";
import IconImg from "../common/IconImg";

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
    "icons selectors button"
    "desc desc desc";
  grid-template-columns: auto 1fr;
  gap: 8px;

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
`;

const AbButton = styled.div`
  grid-area: button;
  display: flex;
  align-items: center;
`;

const AbDesc = styled.div`
  grid-area: desc;
  padding: 8px;
  font-style: italic;
`;

const SelectorPlaceholder = styled.div`
  flex: 1 1 50%;
`;

interface AbilityProps {
  ability: AbilityType;
}
const Ability = ({ ability }: AbilityProps) => {
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
    const result: AbilityResult = {
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
    // todo implement, currently just a copy of rollFull

    const dice: number[] = [];
    const rolled: AbilityResult["rolled"] = {};
    if (ability.required?.type === "power") {
      dice.push(selectedPower.die);
      rolled.power = selectedPower;
    } else {
      dice.push(selectedQuality.die);
      rolled.quality = selectedQuality;
    }

    const [mid] = rollDice(...dice);
    const min = 0;
    const max = 0;
    const result: AbilityResult = {
      char,
      ability,
      roll: { min, mid, max },
      rolled,
    };
    addAbilityResult(result);
  }, [selectedPower, selectedQuality, char, ability, addAbilityResult]);

  const handleRoll = useCallback(() => {
    if (ability.single) handleRollSingle();
    else handleRollFull();
  }, [handleRollFull, handleRollSingle, ability]);

  return (
    <AbCont $ab={ability}>
      <AbName>{ability.name}</AbName>
      <AbIcons>{iconImgs}</AbIcons>
      <AbSelectors>
        {powerSelector}
        {qualitySelector}
      </AbSelectors>
      <AbButton>
        <Button onClick={handleRoll}>Roll</Button>
      </AbButton>
      {ability.description && <AbDesc>{ability.description}</AbDesc>}
    </AbCont>
  );
};

const getInitialPower = (ability: AbilityType, char: Character): Power => {
  if (!ability.required || ability.required.type !== "power") return nonePower;
  const pow = char.powers.find((p) => p.name === ability.required?.name);

  if (!pow) {
    // todo
    throw "Bad pow!";
  }

  return {
    name: ability.required.name,
    type: "power",
    die: pow.die,
  };
};

const getInitialQuality = (ability: AbilityType, char: Character): Quality => {
  if (!ability.required || ability.required.type !== "quality")
    return noneQuality;
  const qual = char.qualities.find((q) => q.name === ability.required?.name);

  if (!qual) {
    // todo
    throw "Bad qual!";
  }

  return {
    name: ability.required.name,
    type: "quality",
    die: qual.die,
  };
};

export default Ability;
