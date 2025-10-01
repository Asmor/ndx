import { useMemo, useState } from "react";
import useCharacters from "../../services/useCharacters";
import Ability from "./Ability";
import styled from "styled-components";
import Panel, { panelMargin, panelTitleHeight } from "../common/Panel";
import { colorsByColor } from "../../util/charMgmt/misc";
import type { AbilityIcon, GYRO } from "../../constants";
import type {
  Ability as AbilityType,
  Character,
} from "../../util/charMgmt/types";
import colors from "../../util/colors";
import icons from "../../util/icons";
import { Edit } from "lucide-react";

const AbilitiesCont = styled(Panel)`
  padding: ${panelTitleHeight}px 0 0 0;
  width: 480px;
  height: calc(100% - ${panelMargin * 2}px);
  display: flex;
  flex-direction: column;
`;

const AbilitiesScroll = styled.div`
  overflow: scroll;
  min-height: 0;
`;

const statusOptions = ["Green", "Yellow", "Red", "Out"];
const filterOptions = [
  "All",
  "attack",
  "defend",
  "boost",
  "hinder",
  "overcome",
  "recover",
  "no icon",
];

const OptionsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`;

const Option = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 2px dotted ${colors.fg};
  flex-grow: 0;
  width: fit-content;
  white-space: nowrap;
  min-height: 40px;

  &:has(:checked) {
    border-style: solid;
  }

  & input {
    display: none;
  }
`;

interface StatusOptionProps {
  color: GYRO;
}
const StatusOption = styled(Option)<StatusOptionProps>`
  border: 2px dotted ${(p) => colorsByColor[p.color]};
`;

const NoAbilities = styled.div`
  padding: 24px;
  display: flex;
  justify-content: center;
`;

interface StatusOptionsProps {
  char: Character;
  status: string;
  setStatus: (s: string) => void;
}
const StatusOptions = ({ char, status, setStatus }: StatusOptionsProps) => (
  <OptionsContainer>
    {statusOptions.map((option) => {
      const gyro = option.toLowerCase() as GYRO;
      const die = gyro === "out" ? "" : `d${char.status[gyro]}`;
      return (
        <StatusOption key={option} color={gyro}>
          <input
            type="radio"
            name="status"
            value={option}
            checked={status === option}
            onChange={() => setStatus(option)}
          />
          {option}
          {die && <>&nbsp;{die}</>}
        </StatusOption>
      );
    })}
  </OptionsContainer>
);

const FilterImg = styled.img`
  height: 18px;
`;

const getFilterOptionDisplay = (option: string) => {
  const imgSrc = icons.action[option];
  if (icons.action[option])
    return (
      <FilterImg
        src={imgSrc}
        alt={option}
        data-tooltip-id="tooltip"
        data-tooltip-content={option}
      />
    );
  return option;
};

interface FilterOptionsProps {
  filter: string;
  setFilter: (s: string) => void;
}
const FilterOptions = ({ filter, setFilter }: FilterOptionsProps) => (
  <OptionsContainer>
    {filterOptions.map((option) => {
      return (
        <Option key={option}>
          <input
            type="radio"
            name="filter"
            value={option}
            checked={filter === option}
            onChange={() => setFilter(option)}
          />
          {getFilterOptionDisplay(option)}
        </Option>
      );
    })}
  </OptionsContainer>
);

const StyledEdit = styled(Edit)`
  cursor: pointer;
`;

const Abilities = () => {
  const { getCurrentCharacter, status, setStatus, setShowEditor } =
    useCharacters();
  const [filter, setFilter] = useState(filterOptions[0]);
  const char = getCurrentCharacter();

  const charAbilities = useMemo(() => {
    const abilities: AbilityType[] = [];

    switch (status) {
      case "Out":
        return char.abilities.out;
      case "Red":
        abilities.unshift(...char.abilities.red); /* falls through */
      case "Yellow":
        abilities.unshift(...char.abilities.yellow); /* falls through */
      default:
        abilities.unshift(...char.abilities.green);
        abilities.push(...char.abilities.basic);
    }

    if (filter === "All") return abilities;
    if (filter === "no icon")
      return abilities.filter((ability) =>
        ability.effects.every((effect) => effect.icons.length === 0)
      );

    return abilities.filter((ability) =>
      ability.effects.some((effect) =>
        effect.icons.includes(filter as AbilityIcon)
      )
    );
  }, [char, status, filter]);

  const abilities = useMemo(() => {
    if (charAbilities.length === 0) {
      const noAbilitiesText = (() => {
        switch (filter) {
          case "All":
            return "";
          case "no icon":
            return "iconless";
          default:
            return filter.toLowerCase();
        }
      })();
      return (
        <NoAbilities>
          No {noAbilitiesText} abilities available at {status} status.
        </NoAbilities>
      );
    }
    return charAbilities.map((ability) => (
      <Ability ability={ability} key={ability.name} />
    ));
  }, [charAbilities, filter, status]);

  return (
    <AbilitiesCont
      panelTitle={
        <>
          {char.name}'s Abilities{" "}
          <StyledEdit size={18} onClick={() => setShowEditor(true)} />
        </>
      }
    >
      <StatusOptions char={char} status={status} setStatus={setStatus} />
      <FilterOptions filter={filter} setFilter={setFilter} />
      <AbilitiesScroll>{abilities}</AbilitiesScroll>
    </AbilitiesCont>
  );
};

export default Abilities;
