import { useCallback, useMemo, type ChangeEvent } from "react";
import type { Power, Quality } from "../../util/charMgmt/types";
import styled from "styled-components";
import colors from "../../util/colors";

const Select = styled.select`
  border: 1px solid ${colors.fg};
  color: ${colors.fg};
  background: ${colors.bg};
  padding: 4px;
  border-radius: 8px;
  flex: 0 1 50%;

  &:disabled {
    border-color: ${colors.panel};
    background-color: ${colors.panel};
    appearance: none;
  }
`;

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
  const options = useMemo(() => {
    return [...pqList, noneOption].map((pq, index) => {
      return (
        <option value={pq.name} key={index}>{`${pq.name} d${pq.die}`}</option>
      );
    });
  }, [pqList, noneOption]);

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const newName = evt.target.value;
      const newVal = [...pqList, noneOption].find((pq) => pq.name === newName);
      if (newVal) handleChange(newVal);
    },
    [handleChange, noneOption, pqList]
  );

  return (
    <Select disabled={locked} value={selected.name} onChange={onChange}>
      {options}
    </Select>
  );
};

export default PqSelector;
