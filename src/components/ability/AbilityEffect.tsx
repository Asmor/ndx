import styled from "styled-components";
import NdxPill from "../results/NdxPill";
import * as iconSrcs from "../../util/icons";
import type { AbilityEffect as AbilityEffectType } from "../../util/charMgmt/types";
import type { MinMidMax } from "../../constants";
import { useMemo } from "react";
import colors from "../../util/colors";

const iconSize = 18;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconImg = styled.img`
  height: ${iconSize}px;
`;

const Container = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid ${colors.fg};
  border-radius: 8px;
  padding: 4px;
`;

interface AbilityEffectProps {
  roll: MinMidMax;
  effect: AbilityEffectType;
}
const AbilityEffect = ({ roll, effect }: AbilityEffectProps) => {
  const value = useMemo(() => {
    return [
      { used: effect.ndx.n, val: roll.min },
      { used: effect.ndx.d, val: roll.mid },
      { used: effect.ndx.x, val: roll.max },
    ]
      .filter(({ used }) => used)
      .reduce((acc, { val }) => acc + (val as number), 0);
  }, [roll, effect]);

  const tooltipContent = useMemo(() => {
    const parts = [effect.icons.join(", "), "using"];
    const minMidMax: string[] = [];
    if (effect.ndx.n) minMidMax.push("Min");
    if (effect.ndx.d) minMidMax.push("Mid");
    if (effect.ndx.x) minMidMax.push("Max");
    parts.push(minMidMax.join("+"), "=", value.toString());
    return parts.join(" ");
  }, [value, effect]);

  return (
    <>
      <Container
        data-tooltip-id="tooltip"
        data-tooltip-content={tooltipContent}
      >
        <NdxPill ndx={effect.ndx} />
        <Icons>
          {effect.icons.map((icon) => (
            <IconImg
              src={iconSrcs.default.action[icon]}
              alt={icon}
              key={icon}
            />
          ))}
        </Icons>
        {value}
      </Container>
    </>
  );
};

export default AbilityEffect;
