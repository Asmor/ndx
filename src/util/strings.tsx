import type React from "react";
import styled from "styled-components";

const Highlight = styled.strong`
  font-weight: bold;
  font-variant: small-caps;
  text-decoration: underline dotted;
`;

interface HighlightTextProps {
  text: string;
  phrase: string;
  HighlightComponent?: React.ElementType;
}
export const highlightText = ({
  text,
  phrase,
  HighlightComponent = Highlight,
}: HighlightTextProps) => {
  // Escape regex special characters in the phrase
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.match(regex) ? (
      <HighlightComponent key={index}>{part}</HighlightComponent>
    ) : (
      part
    )
  );
};
