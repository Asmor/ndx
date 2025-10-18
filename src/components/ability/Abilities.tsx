import { useCallback, useMemo, useState } from "react";
import useLoadouts from "../../services/useLoadouts";
import Ability from "./Ability";
import styled from "styled-components";
import Panel, { panelMargin, panelTitleHeight } from "../common/Panel";
import { BlankCharacter, colorsByColor } from "../../util/charMgmt/misc";
import type { AbilityIcon, GYRO } from "../../constants";
import {
  // This is unnecessarily confusing, but...
  // - Abilty = Component that displays an ability
  // - AbilityTSType = The TS type which defines the shape of an ability object
  //   (so-named to disambiguate from AbilityType, which is the type of an
  //   ability (action, etc))
  type Ability as AbilityTSType,
  type Character,
} from "../../util/charMgmt/types";
import colors from "../../util/colors";
import { Edit } from "lucide-react";
import { FilterSelect, type FilterOption } from "../common/FilterSelect";
import Button from "../common/Button";

const AbilitiesCont = styled(Panel)`
  padding: ${panelTitleHeight}px 0 0 0;
  width: 480px;
  height: calc(100% - ${panelMargin * 2}px);
  display: flex;
  flex-direction: column;
`;

const AbilitiesScroll = styled.div`
  overflow: auto;
  min-height: 0;
`;

const statusOptions = ["Green", "Yellow", "Red", "Out"];
const defaultIconFilter = "All";
const iconFilterOptions: FilterOption<string>[] = [
  { label: "All", value: "All" },
  { label: "Attack", value: "attack" },
  { label: "Defend", value: "defend" },
  { label: "Boost", value: "boost" },
  { label: "Hinder", value: "hinder" },
  { label: "Overcome", value: "overcome" },
  { label: "Recover", value: "recover" },
  { label: "No Icons", value: "no icon" },
];
const defaultTypeFilter = "All";
const typeFilterOptions: FilterOption<string>[] = [
  { label: "All", value: "All" },
  { label: "Action", value: "a" },
  { label: "Inherent", value: "i" },
  { label: "Reaction", value: "r" },
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

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
`;

const NoAbilities = styled.div`
  padding: 24px;
  display: flex;
  justify-content: center;
`;

const evalAbilityFilter = (
  ability: AbilityTSType,
  iconFilter: string,
  typeFilter: string
) => {
  if (iconFilter !== "All") {
    if (iconFilter === "no icon") {
      const hasIcons = ability.effects.some(
        (effect) => effect.icons.length > 0
      );

      if (hasIcons) return false;
    } else {
      const hasIcon = ability.effects.some((effect) =>
        effect.icons.includes(iconFilter as AbilityIcon)
      );
      if (!hasIcon) return false;
    }
  }

  if (typeFilter !== "All") {
    // todo do I want to add an option for matching abilities missing type?
    return ability.type === typeFilter;
  }

  return true;
};

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

const getNoMatchMessage = (
  iconFilter: string,
  typeFilter: string,
  status: string
) => {
  const iconText = (() => {
    switch (iconFilter) {
      case "All":
        return "";
      case "no icon":
        return "iconless";
      default:
        return iconFilter.toLowerCase();
    }
  })();

  const typeText = (() => {
    switch (typeFilter) {
      case "All":
        return "";
      case "a":
        return "action";
      case "i":
        return "inherent";
      case "r":
        return "reaction";
      default:
        return iconFilter.toLowerCase();
    }
  })();

  return `No ${typeText} ${iconText} abilities available at ${status} status.`;
};

const StyledEdit = styled(Edit)`
  cursor: pointer;
`;

const Abilities = () => {
  const { getCurrentLoadout, status, setStatus, setShowEditor } = useLoadouts();
  const [iconFilter, setIconFilter] = useState(defaultIconFilter);
  const [typeFilter, setTypeFilter] = useState(defaultTypeFilter);
  // todo update this to discriminate based on type of loadout
  const char = (getCurrentLoadout() as Character) ?? BlankCharacter;

  // Get all the character's abilities and apply filters
  const charAbilities = useMemo(() => {
    const abilities: AbilityTSType[] = [];

    switch (status) {
      case "Out":
        abilities.unshift(...char.abilities.out);
        break;
      case "Red":
        abilities.unshift(...char.abilities.red); /* falls through */
      case "Yellow":
        abilities.unshift(...char.abilities.yellow); /* falls through */
      default:
        abilities.unshift(...char.abilities.green);
        abilities.push(...char.abilities.basic);
    }

    return abilities.filter((ability) =>
      evalAbilityFilter(ability, iconFilter, typeFilter)
    );
  }, [status, char, iconFilter, typeFilter]);

  // map character's abilities to components or display message if none
  const abilities = useMemo(() => {
    if (charAbilities.length === 0) {
      return (
        <NoAbilities>
          {getNoMatchMessage(iconFilter, typeFilter, status)}
        </NoAbilities>
      );
    }

    return charAbilities.map((ability) => (
      <Ability ability={ability} key={ability.name} />
    ));
  }, [charAbilities, iconFilter, status, typeFilter]);

  const resetFilters = useCallback(() => {
    setIconFilter(defaultIconFilter);
    setTypeFilter(defaultTypeFilter);
  }, []);

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
      <Filters>
        Icon:
        <FilterSelect
          options={iconFilterOptions}
          selected={iconFilter}
          setFilter={setIconFilter}
        />
        Type:
        <FilterSelect
          options={typeFilterOptions}
          selected={typeFilter}
          setFilter={setTypeFilter}
        />
        <Button $variant="danger" onClick={resetFilters}>
          reset
        </Button>
      </Filters>
      <AbilitiesScroll>{abilities}</AbilitiesScroll>
    </AbilitiesCont>
  );
};

export default Abilities;
