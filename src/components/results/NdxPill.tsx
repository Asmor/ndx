import styled, { css } from "styled-components";
import colors from "../../util/colors";
import type { MinMidMax, NDX } from "../../constants";

interface PillProps {
  variant: string;
}
const Pill = styled.div<PillProps>`
  height: ${(p) => (p.variant === "large" ? 128 : 24)}px;
  display: flex;
  align-items: center;
  gap: 2px;
  border: 1px solid ${colors.fg};
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.bg};
  flex-direction: column;
`;

interface SectionProps {
  $on: boolean;
  label: string;
  value: number;
  variant: string;
}
const Section = styled.div<SectionProps>`
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${colors.bg};
  background: ${colors.bg};
  width: ${(p) => (p.variant === "large" ? 24 : 12)}px;
  position: relative;
  font-weight: bold;
  ${(p) =>
    p.$on
      ? css`
          background: ${colors.accent};

          ${p.value
            ? css`
                color: ${colors.accentContrast};
                overflow: hidden;
                &:before {
                  content: "${p.value}";
                }

                &:after {
                  content: "${p.label}";
                  font-size: 0.6em;
                }
              `
            : ""}
        `
      : ""}
`;

interface NdxPropsMini {
  ndx: NDX;
}
interface NdxPropsLarge extends MinMidMax {
  variant: "large";
}
type NdxProps = NdxPropsMini | NdxPropsLarge;
const NdxPill = (props: NdxProps) => {
  const ndx = "ndx" in props ? props.ndx : { n: true, d: true, x: true };
  const { min, mid, max, variant } =
    "variant" in props ? props : { min: 0, mid: 0, max: 0, variant: "small" };

  const pieces: string[] = [];
  if (ndx.n) pieces.push(`Min${min ? ` ${min}` : ""}`);
  if (ndx.d) pieces.push(`Mid${mid ? ` ${mid}` : ""}`);
  if (ndx.x) pieces.push(`Max${max ? ` ${max}` : ""}`);
  const title = pieces.join(" + ");
  return (
    <Pill title={title} variant={variant}>
      <Section
        $on={!!ndx.x}
        label="max"
        value={max}
        variant={variant}
      ></Section>
      <Section
        $on={!!ndx.d}
        label="mid"
        value={mid}
        variant={variant}
      ></Section>
      <Section
        $on={!!ndx.n}
        label="min"
        value={min}
        variant={variant}
      ></Section>
    </Pill>
  );
};

export default NdxPill;
