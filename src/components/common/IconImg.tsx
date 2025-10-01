import styled from "styled-components";
import type { AbilityIcon } from "../../constants";
import icons from "../../util/icons";

const Img = styled.img<{ size: number; fixedWidth?: boolean }>`
  height: ${(p) => p.size}px;
  width: ${(p) => (p.fixedWidth ? `${p.size}px` : "auto")};
  object-fit: contain;
  object-position: center;
`;

interface IconImgProps {
  size: number;
  icon: AbilityIcon;
  fixedWidth?: boolean;
  className?: string;
}
const IconImg = ({ size, icon, fixedWidth, className }: IconImgProps) => {
  const imgSrc = icons.action[icon];

  return (
    <Img
      size={size}
      alt={icon}
      src={imgSrc}
      fixedWidth={fixedWidth}
      className={className}
    />
  );
};

export default IconImg;
