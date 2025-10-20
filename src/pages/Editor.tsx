import styled from "styled-components";
import TextEditor from "../components/editor/TextEditor";
import Abilities from "../components/ability/Abilities";
import FullScreenGrid from "../components/layout/FullScreenGrid";
import GridArea from "../components/layout/GridArea";
import useLoadouts from "../services/useLoadouts";
import { useState } from "react";
import type { Character } from "../util/charMgmt/types";

const Layout = styled(FullScreenGrid)`
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "editor preview";
`;

const Editor = () => {
  const { getCurrentLoadout } = useLoadouts();
  const [previewChar, setPrevieChar] = useState(
    getCurrentLoadout() as Character
  );

  return (
    <Layout>
      <GridArea area="editor" align="right">
        <TextEditor setPreviewChar={setPrevieChar} />
      </GridArea>
      <GridArea area="preview">
        <Abilities preview={true} char={previewChar} />
      </GridArea>
    </Layout>
  );
};

export default Editor;
