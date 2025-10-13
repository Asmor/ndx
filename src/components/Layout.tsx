import styled from "styled-components";
import Abilities from "./ability/Abilities";
import RecentHistory from "./RecentHistory";

const LayoutContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: grid;
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

const Layout = () => {
  return (
    <LayoutContainer>
      <Right>
        <Abilities />
      </Right>
      <Left></Left>
      <CenterTop>
        <RecentHistory />
      </CenterTop>
      <CenterBot></CenterBot>
    </LayoutContainer>
  );
};

export default Layout;
