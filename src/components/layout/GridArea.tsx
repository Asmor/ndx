import styled from "styled-components";
import type { ChildProps } from "../../constants";

interface GridAreaElProps {
  $area: string;
  $align: string;
}
const GridAreaEl = styled.div<GridAreaElProps>`
  overflow: hidden;
  display: flex;
  justify-content: ${(p) => p.$align};
`;

interface GridAreaProps extends ChildProps {
  area: string;
  align?: string;
}
const GridArea = ({ area, children, align = "left" }: GridAreaProps) => {
  return (
    <GridAreaEl $area={area} $align={align}>
      {children}
    </GridAreaEl>
  );
};

export default GridArea;
