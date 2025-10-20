import type React from "react";
import styled, { css } from "styled-components";
import colors from "./colors";

interface HighlightProps {
  $hasTooltip: boolean;
  $valid: boolean;
}
const Highlight = styled.strong<HighlightProps>`
  font-weight: bold;
  font-variant: small-caps;
  text-decoration: underline dotted;
  ${(p) =>
    !p.$valid
      ? css`
          color: ${colors.red};
        `
      : ""}
  &[data-tooltip-content] {
    cursor: help;
  }
`;

interface HighlightTextProps {
  text: string;
  phrase: string;
  HighlightComponent?: React.ElementType;
  tooltip?: string;
  valid?: boolean;
}
export const highlightText = ({
  text,
  phrase,
  HighlightComponent = Highlight,
  tooltip,
  valid = true,
}: HighlightTextProps) => {
  // Escape regex special characters in the phrase
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  const tooltipAttrs = tooltip
    ? {
        "data-tooltip-id": "tooltip",
        "data-tooltip-content": tooltip,
      }
    : {};

  return parts.map((part, index) =>
    part.match(regex) ? (
      <HighlightComponent {...tooltipAttrs} $valid={valid} key={index}>
        {part}
      </HighlightComponent>
    ) : (
      part
    )
  );
};
