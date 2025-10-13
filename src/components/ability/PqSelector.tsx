import { useMemo } from "react";
import type { Power, Quality } from "../../util/charMgmt/types";
import styled from "styled-components";
import colors from "../../util/colors";
import Select, { components, type SingleValueProps } from "react-select";

interface SelectorOption<T> {
  value: T;
  label: string;
}

const StyledSelect = styled(Select)`
  flex: 1 1 0;
  border: 1px solid ${colors.fg};
  border-radius: 8px;
  min-width: 0;

  &.pqs--is-disabled {
    border: 1px solid transparent;
    /* color: red; */
    & .pqs__indicators {
      visibility: hidden;
    }
  }

  & .pqs__control {
    padding: 4px;
    min-height: 0;
  }
  & .value-container {
  }
  & .indicators {
  }
  & .pqs__menu {
    background-color: ${colors.bg};
    padding: 4px 0;
    border: 1px solid ${colors.fg};
    border-radius: 8px;
    min-width: 100%;
    white-space: nowrap;
    overflow: hidden;
  }
  & .pqs__menu-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  & .pqs__option {
    padding: 2px 4px;

    &:hover {
      background-color: ${colors.accent};
      color: ${colors.accentContrast};
    }
  }
`;

const SingleValueWrapper = styled.div`
  display: flex;
  gap: 4px;
`;
const SingleValueName = styled.div`
  flex: 1 1 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SingleValueDie = styled.div`
  flex: 0 0 auto;
`;

const SingleValue = (props: SingleValueProps) => {
  const option = props.data as SelectorOption<Power | Quality>;
  const { name, die } = option.value;
  const prefix = option.value.type === "power" ? "p" : "q";
  return (
    <components.SingleValue {...props}>
      <SingleValueWrapper>
        <SingleValueName>
          {prefix}: {name}
        </SingleValueName>
        <SingleValueDie>d{die}</SingleValueDie>
      </SingleValueWrapper>
    </components.SingleValue>
  );
};

interface PqSelectorProps<T extends Power | Quality> {
  pqList: T[];
  selected: T;
  locked: boolean;
  noneOption: T;
  handleChange: (newVal: T) => void;
}
const PqSelector = <T extends Power | Quality>({
  pqList,
  selected,
  locked,
  noneOption,
  handleChange,
}: PqSelectorProps<T>) => {
  const options: SelectorOption<T>[] = useMemo(() => {
    return [...pqList, noneOption].map((pq) => {
      return { value: pq, label: `${pq.name} d${pq.die}` };
    });
  }, [pqList, noneOption]);

  return (
    <StyledSelect
      unstyled
      components={{ SingleValue }}
      value={options.find((opt) => opt.value.name === selected.name)}
      isDisabled={locked}
      options={options}
      classNamePrefix={"pqs"}
      onChange={(opt) => {
        handleChange((opt as SelectorOption<T>).value);
      }}
    />
  );
};

export default PqSelector;
