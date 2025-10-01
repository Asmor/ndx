import styled, { css } from "styled-components";
import type { AbilityResult } from "../../util/charMgmt/types";
import Panel from "../common/Panel";
import AbilityEffect from "./AbilityEffect";
import FromNow from "../common/FromNow";
import { useEffect, useState } from "react";
import NdxPill from "../results/NdxPill";
import { getUsedIcons } from "../../util/ability";
import IconImg from "../common/IconImg";

// todo want to get these resizing to take better advantage of their container's available width.
const minContainerWidth = 360;
// const maxContainerWidth = minContainerWidth * 2;

interface ContainerProps {
  flash: boolean;
}
const Container = styled(Panel)<ContainerProps>`
  display: grid;
  grid-template-areas:
    "pill rolls"
    "pill info"
    "pill effects";
  grid-template-rows: auto auto 1fr;
  grid-template-columns: auto 1fr;
  gap: 8px;
  width: ${minContainerWidth}px;
  height: 100%;
  margin: 0;
  transition: all 500ms cubic-bezier(0.5, 0, 0.5, 1.5);
  flex: 1;

  ${(p) =>
    p.flash
      ? css`
          transform: scale(0);
        `
      : ""}
`;

const Pill = styled.div`
  grid-area: pill;
`;

const Rolls = styled.div`
  grid-area: rolls;
  height: fit-content;
  gap: 4px;
  font-size: 0.8em;
`;

const Info = styled.div`
  grid-area: info;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: fit-content;
  gap: 4px;
  font-style: italic;
`;

const Effects = styled.div`
  grid-area: effects;
  display: flex;
  align-items: end;
  justify-content: end;
  gap: 8px;
`;

const SpacedImg = styled(IconImg)`
  margin-right: 4px;
`;

const conjugate = (
  label: string,
  { name, die }: { name: string; die: number }
) => `${label}: ${name} d${die}, `;

const AbilityResultDisplay = ({
  ability,
  roll,
  rolled,
  timestamp,
}: AbilityResult & { timestamp: Date }) => {
  const [flash, setFlash] = useState(true);
  useEffect(() => void setTimeout(() => setFlash(false), 100), [setFlash]);
  const { min, mid, max } = roll;
  const title = (
    <>
      {getUsedIcons(ability).map((icon, index) => (
        <SpacedImg icon={icon} size={18} key={index} />
      ))}
      {ability.name}
    </>
  );
  const rolledParts: string[] = [];
  if (rolled.power) rolledParts.push(conjugate("P", rolled.power));
  if (rolled.quality) rolledParts.push(conjugate("Q", rolled.quality));
  if (rolled.status) rolledParts.push(conjugate("S", rolled.status));
  if (rolledParts.length > 0) {
    const lastIndex = rolledParts.length - 1;
    rolledParts[lastIndex] = rolledParts[lastIndex].replace(/, $/, "");
  }
  return (
    <Container
      panelTitle={title}
      panelFooter={<FromNow date={timestamp} />}
      flash={flash}
    >
      <Rolls>
        {rolledParts.map((part) => (
          <span>{part}</span>
        ))}
      </Rolls>
      <Info>{ability.description}</Info>
      <Pill>
        <NdxPill variant="large" min={min} mid={mid} max={max} />
      </Pill>
      <Effects>
        {ability.effects.map((effect, index) => (
          <AbilityEffect effect={effect} roll={roll} key={index} />
        ))}
      </Effects>
    </Container>
  );
};

export default AbilityResultDisplay;
