import styled from "styled-components";
import colors from "../../util/colors";

interface ButtonProps {
  $variant?: "normal" | "danger";
  disabled?: boolean;
}
const Button = styled.button<ButtonProps>`
  flex: 0 0 fit-content;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border: 1px solid ${colors.fg};
  background-color: ${(p) => getButtonColors(p).bg};
  color: ${(p) => getButtonColors(p).fg};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  border-radius: 8px;
  gap: 4px;

  &:hover {
    border-color: ${colors.accentLow};
  }

  &:active {
    border-color: ${colors.accentHigh};
  }
`;

const getButtonColors = (props: ButtonProps) => {
  if (props.disabled) {
    return { bg: colors.neutral, fg: colors.fg };
  } else if (props.$variant === "danger") {
    return { bg: colors.red, fg: colors.fg };
  } else {
    return { bg: colors.accent, fg: colors.accentContrast };
  }
};

export default Button;
