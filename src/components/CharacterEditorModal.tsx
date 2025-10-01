import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import useCharacters from "../services/useCharacters";
import Panel from "./common/Panel";
import colors from "../util/colors";
import { parseCharacter } from "../util/charMgmt/parsers";
import { CheckCircle, XCircle } from "lucide-react";
import Button from "./common/Button";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBody = styled(Panel)`
  min-height: 50vh;
  min-width: 360px;
  max-height: 90vh;
  max-width: 90vw;
  display: grid;
  grid-template-areas:
    "editor instructions"
    "editor validator"
    "editor buttons";
  grid-template-rows: 1fr auto auto;
  grid-template-columns: 360px 360px;
  gap: 8px;
`;

const Editor = styled.div`
  grid-area: editor;
`;
const Instructions = styled.div`
  grid-area: instructions;
`;
const Validator = styled.div`
  grid-area: validator;
  // text is only shown if invalid
  color: ${colors.red};
`;
const Buttons = styled.div`
  grid-area: buttons;
  display: flex;
  gap: 8px;
`;

const TextArea = styled.textarea`
  border: 1px solid ${colors.fg};
  background: ${colors.bg};
  color: ${colors.fg};
  padding: 8px;
  min-height: 50vh;
  min-width: 360px;
`;

const blank = `Johnny Hero

Powers

Qualities

Status 6, 8, 10

Abilities`;

const CharacterEditorModal = () => {
  const { getRaw, updateChar, showEditor, setShowEditor, getSampleText } =
    useCharacters();
  const [def, setDef] = useState(getRaw());
  const [validation, setValidation] = useState({ valid: true, error: "" });

  useEffect(() => {
    setDef(getRaw());
  }, [showEditor, getRaw]);

  useEffect(() => {
    try {
      parseCharacter(def);
      setValidation({ valid: true, error: "" });
    } catch (ex) {
      setValidation({ valid: false, error: (ex as Error).message });
    }
  }, [def]);

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      setDef(evt.target.value);
    },
    [setDef]
  );

  if (!showEditor) return null;
  return (
    <Backdrop>
      <ModalBody panelTitle="Edit character">
        <Editor>
          <TextArea value={def} onChange={handleChange} wrap="off" />
        </Editor>
        <Instructions>
          See{" "}
          <a
            href="https://github.com/Asmor/ndx/#ndx-sentinel-comics-rpg-dice-roller"
            target="_blank"
          >
            the readme
          </a>{" "}
          for instructions.
        </Instructions>
        <Validator>
          {validation.error}
          <br />
          {validation.valid ? (
            <CheckCircle color={colors.green} />
          ) : (
            <XCircle color={colors.red} />
          )}
        </Validator>
        <Buttons>
          <Button
            disabled={!validation.valid}
            onClick={() => {
              updateChar(def, parseCharacter(def));
              setShowEditor(false);
            }}
          >
            Set Character
          </Button>
          <Button onClick={() => setDef(blank)}>Insert blank template</Button>
          <Button onClick={() => setDef(getSampleText())}>
            Insert sample hero
          </Button>
          <Button $variant="danger" onClick={() => setShowEditor(false)}>
            Cancel
          </Button>
        </Buttons>
      </ModalBody>
    </Backdrop>
  );
};

export default CharacterEditorModal;
