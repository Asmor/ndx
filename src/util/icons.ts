import type { DNotation } from "../constants";

interface Icons {
  action: Record<string, string>;
  die: Record<DNotation, string>;
}

const icons: Icons = {
  action: {
    attack: "icons/action/attack.png",
    boost: "icons/action/boost.png",
    defend: "icons/action/defend.png",
    hinder: "icons/action/hinder.png",
    overcome: "icons/action/overcome.png",
    recover: "icons/action/recover.png",
  },
  die: {
    d4: "icons/die/d4.png",
    d6: "icons/die/d6.png",
    d8: "icons/die/d8.png",
    d10: "icons/die/d10.png",
    d12: "icons/die/d12.png",
  },
};

export default icons;
