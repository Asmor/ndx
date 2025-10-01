import styled from "styled-components";
import Panel from "../components/common/Panel";
import colors from "./colors";

const ColorTestLayout = styled.div`
  display: flex;
`;

const ColorTestContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colors.fg};
  background: ${colors.bg};
  align-items: center;
`;

const AccentLow = styled(Panel)`
  background-color: ${colors.accentLow};
  color: ${colors.accentContrastLow};
`;
const AccentMed = styled(Panel)`
  background-color: ${colors.accent};
  color: ${colors.accentContrast};
`;
const AccentHigh = styled(Panel)`
  background-color: ${colors.accentHigh};
  color: ${colors.accentContrastHigh};
`;

const ColorTests = () => (
  <Panel>
    <AccentLow>
      Accent <b>Low</b>
    </AccentLow>
    <AccentMed>
      Accent <b>Med</b>
    </AccentMed>
    <AccentHigh>
      Accent <b>High</b>
    </AccentHigh>
  </Panel>
);

const ColorTesting = () => (
  <ColorTestLayout>
    <div className="force-dark-mode">
      <ColorTestContainer>
        Dark Mode
        <ColorTests />
      </ColorTestContainer>
    </div>
    <div className="force-light-mode">
      <ColorTestContainer>
        Light Mode
        <ColorTests />
      </ColorTestContainer>
    </div>
  </ColorTestLayout>
);

export default ColorTesting;
