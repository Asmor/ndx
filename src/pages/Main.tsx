import styled from "styled-components";
import Abilities from "../components/ability/Abilities";
import RecentHistory from "../components/RecentHistory";
import FullScreenGrid from "../components/layout/FullScreenGrid";
import useLoadouts from "../services/useLoadouts";
import type { Character } from "../util/charMgmt/types";

const LayoutContainer = styled(FullScreenGrid)`
  grid-template-areas:
    "right center-top left"
    "right center-bot left";
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr auto;
`;

const Fill = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const Right = styled(Fill)`
  grid-area: right;
`;
const Left = styled(Fill)`
  grid-area: left;
`;
const CenterTop = styled(Fill)`
  grid-area: center-top;
`;
const CenterBot = styled(Fill)`
  grid-area: center-bot;
`;

const Main = () => {
  const { getCurrentLoadout } = useLoadouts();
  const char = getCurrentLoadout() as Character;
  return (
    <LayoutContainer>
      <Right>
        <Abilities char={char} />
      </Right>
      <Left></Left>
      <CenterTop>
        <RecentHistory />
      </CenterTop>
      <CenterBot></CenterBot>
    </LayoutContainer>
  );
};

export default Main;
