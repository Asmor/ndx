import Select, { type Props as SelectProps } from "react-select";
import styled from "styled-components";
import colors from "../../util/colors";

function BaseStyledSelect<T>(props: SelectProps<T>) {
  return <Select {...props} unstyled classNamePrefix={"ndx"} />;
}

// todo: This was originally only used for power and quality selectors, so some
// of the styles (like flex) should probably be removed from this and added back
// into that specific usage.
export const StyledSelect = styled(BaseStyledSelect)`
  flex: 1 1 0;
  border: 1px solid ${colors.fg};
  border-radius: 8px;
  min-width: 0;

  &.ndx--is-disabled {
    border: 1px solid transparent;
    /* color: red; */
    & .ndx__indicators {
      visibility: hidden;
    }
  }

  & .ndx__control {
    padding: 4px;
    min-height: 0;
  }
  & .value-container {
  }
  & .indicators {
  }
  & .ndx__menu {
    background-color: ${colors.bg};
    padding: 4px 0;
    border: 1px solid ${colors.fg};
    border-radius: 8px;
    min-width: 100%;
    white-space: nowrap;
    overflow: hidden;
  }
  & .ndx__menu-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  & .ndx__option {
    padding: 2px 4px;

    &:hover {
      background-color: ${colors.accent};
      color: ${colors.accentContrast};
    }
  }
`;
