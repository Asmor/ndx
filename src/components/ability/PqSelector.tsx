import { useMemo } from "react";
import type { Power, Quality } from "../../util/charMgmt/types";
import styled from "styled-components";
import { components, type SingleValueProps } from "react-select";
import { StyledSelect } from "../common/StyledSelect";

interface SelectorOption<T> {
  value: T;
  label: string;
}

const SingleValueWrapper = styled.div`
  display: flex;
  gap: 4px;
`;
const SingleValueName = styled.div`
  flex: 0 1 auto;
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
      components={{ SingleValue }}
      value={options.find((opt) => opt.value.name === selected.name)}
      isDisabled={locked}
      options={options}
      onChange={(opt) => {
        handleChange((opt as SelectorOption<T>).value);
      }}
    />
  );
};

export default PqSelector;
