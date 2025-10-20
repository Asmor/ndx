// todo fix
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable react-refresh/only-export-components */
import styled, { css } from "styled-components";
import type { ChildProps } from "../../constants";
import colors from "../../util/colors";
import { type ReactNode, useCallback } from "react";

export const panelTitleHeight = 24;
export const panelPadding = 8;
export const panelMargin = 8;
export const panelBorderWidth = 2;
export const panelFooterHeight = panelTitleHeight;

interface PanelDivProps {
  $titled: boolean;
  $footed: boolean;
}

const getPanelPadding = (p: PanelDivProps) => {
  let top = panelPadding;
  let bot = panelPadding;
  if (p.$titled) top += panelTitleHeight;
  if (p.$footed) bot += panelFooterHeight;

  return css`
    padding: ${top}px ${panelPadding}px ${bot}px;
  `;
};

const PanelDiv = styled.div<PanelDivProps>`
  max-height: calc(100% - ${panelMargin * 2}px);
  max-width: calc(100% - ${panelMargin * 2}px);
  position: relative;
  background: ${colors.panel};
  color: ${colors.fg};
  width: fit-content;
  border-radius: ${panelMargin}px;
  margin: 8px;
  overflow: hidden;
  border: ${panelBorderWidth}px solid ${colors.fg};

  ${(p) => getPanelPadding(p)};
`;

interface PanelTitleProps {
  $clickable?: boolean;
}

const TitleFooterBase = styled.div<PanelTitleProps>`
  color: ${colors.accentContrast};
  background-color: ${colors.accent};
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  ${(p) =>
    p.$clickable &&
    css`
      cursor: pointer;
    `}
`;

const PanelTitle = styled(TitleFooterBase)<PanelTitleProps>`
  top: 0;
  height: ${panelTitleHeight}px;
  font-weight: bold;
`;

const PanelFooter = styled(TitleFooterBase)<PanelTitleProps>`
  bottom: 0;
  height: ${panelFooterHeight}px;
  justify-content: right;
`;

interface PanelProps extends ChildProps {
  panelTitle?: ReactNode;
  className?: string;
  onTitleClick?: Function;
  panelFooter?: ReactNode;
}

const Panel = ({
  children,
  panelTitle,
  className,
  onTitleClick,
  panelFooter,
}: PanelProps) => {
  const handleTitleClick = useCallback(() => onTitleClick?.(), [onTitleClick]);
  return (
    <PanelDiv
      $titled={!!panelTitle}
      className={className}
      $footed={!!panelFooter}
    >
      {panelTitle && (
        <PanelTitle onClick={handleTitleClick} $clickable={!!onTitleClick}>
          {panelTitle}
        </PanelTitle>
      )}
      {children}
      {panelFooter && <PanelFooter>{panelFooter}</PanelFooter>}
    </PanelDiv>
  );
};

export default Panel;
