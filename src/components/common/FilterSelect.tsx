import { StyledSelect } from "./StyledSelect";

export interface FilterOption<T> {
  label: string;
  value: T;
}

interface FilterProps<T> {
  selected: T;
  setFilter: (newVal: T) => void;
  options: FilterOption<T>[];
}

export const FilterSelect = <T,>({
  selected,
  setFilter,
  options,
}: FilterProps<T>) => {
  const value = options.find((opt) => opt.value === selected);
  return (
    <StyledSelect
      value={value}
      options={options}
      onChange={(selected) => {
        const { value } = selected as FilterOption<T>;
        setFilter(value);
      }}
    />
  );
};
