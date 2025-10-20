import styled from "styled-components";
import type { ComponentProps } from "react";
import { ExternalLink } from "lucide-react";
import colors from "../../util/colors";

const A = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${colors.accent};

  &:hover,
  &:focus {
    color: ${colors.accentHigh};
  }

  &:active {
    color: ${colors.accentLow};
  }
`;

interface ExtLink extends ComponentProps<typeof A> {
  className?: string;
}
const ExtLink = (props: ExtLink) => {
  const nonChildProps = { ...props };
  delete nonChildProps.children;
  return (
    <>
      <A {...nonChildProps}>
        {props.children}
        {props.target === "_blank" && <ExternalLink size="1em" />}
      </A>
    </>
  );
};

export default ExtLink;
