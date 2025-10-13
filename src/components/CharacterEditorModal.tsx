import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import useLoadouts from "../services/useLoadouts";
import Panel from "./common/Panel";
import colors from "../util/colors";
import { parseCharacter } from "../util/charMgmt/parsers";
import { CheckCircle, XCircle } from "lucide-react";
import Button from "./common/Button";
import Link from "./Link";

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
  height: 100%;
  max-height: 90vh;
  width: 100%;
  max-width: 480px;
  display: grid;
  grid-template-areas:
    "instructions"
    "editor"
    "validator"
    "buttons";
  grid-template-rows: auto 1fr auto auto;
  grid-template-columns: 1fr;
  gap: 8px;
`;

const Editor = styled.div`
  grid-area: editor;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Instructions = styled.div`
  grid-area: instructions;
  display: flex;
  justify-content: space-between;
`;
const Validator = styled.div`
  grid-area: validator;
  // text is only shown if invalid
  color: ${colors.red};
  height: 60px;
  overflow: auto;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
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
  flex: 1;
  resize: none;
`;

const blank = `Johnny Hero

Status 6 8 10

Powers

Qualities

Abilities
`;

const CharacterEditorModal = () => {
  const {
    getRaw,
    updateLoadout: updateChar,
    showEditor,
    setShowEditor,
    getSampleText,
  } = useLoadouts();
  const [def, setDef] = useState("");
  const [validation, setValidation] = useState({ valid: true, error: "" });
  const [wrap, setWrap] = useState(false);

  useEffect(() => {
    if (showEditor) setDef(getRaw());
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
          <TextArea
            value={def}
            onChange={handleChange}
            wrap={wrap ? "on" : "off"}
          />
        </Editor>
        <Instructions>
          <span>
            See{" "}
            <Link
              href="https://github.com/Asmor/ndx/#ndx-sentinel-comics-rpg-dice-roller"
              target="_blank"
            >
              the readme
            </Link>{" "}
            for instructions.
          </span>
          <label>
            <input
              type="checkbox"
              onChange={() => setWrap(!wrap)}
              checked={wrap}
            />{" "}
            Wrap lines
          </label>
        </Instructions>
        <Validator>
          {validation.valid ? (
            <CheckCircle color={colors.green} />
          ) : (
            <XCircle color={colors.red} />
          )}{" "}
          {validation.error}
        </Validator>
        <Buttons>
          <Button
            disabled={!validation.valid}
            onClick={() => {
              updateChar(parseCharacter(def));
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
