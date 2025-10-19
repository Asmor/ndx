import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import styled, { css } from "styled-components";
import useLoadouts from "../services/useLoadouts";
import Panel from "./common/Panel";
import colors from "../util/colors";
import { parseCharacter } from "../util/charMgmt/parsers";
import { CheckCircle, XCircle } from "lucide-react";
import Button from "./common/Button";
import Link from "./Link";
import LZString from "lz-string";
import { CopyButton } from "./common/CopyButton";
import FlexSpacer from "./common/FlexSpacer";

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
const Validator = styled.div<{ $valid: boolean }>`
  grid-area: validator;
  ${(p) =>
    p.$valid
      ? css`
          // Valid
          display: flex;
          align-items: flex-start;
        `
      : css`
          // Errors
          overflow: auto;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 8px;
          color: ${colors.red};
        `}
  height: 60px;
`;

const ValidLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1 1 auto;
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

const getShareLink = (data: string) => {
  const { protocol, host, pathname } = document.location;
  const shareData = LZString.compressToEncodedURIComponent(data);
  return `${protocol}//${host}${pathname}?character=${shareData}`;
};

const getMarkdownShareLink = (name: string, data: string) => {
  const link = getShareLink(data);
  return `[Load ${name} in NDX](${link})`;
};

const CharacterEditorModal = () => {
  const {
    getRaw,
    updateLoadout: updateChar,
    showEditor,
    setShowEditor,
    getSampleText,
  } = useLoadouts();
  const [def, setDef] = useState("");
  const [validation, setValidation] = useState({
    valid: true,
    error: "",
    name: "",
  });
  const [wrap, setWrap] = useState(false);

  useEffect(() => {
    if (showEditor) {
      const curDef = getRaw();
      setDef(curDef);
    }
  }, [showEditor, getRaw]);

  useEffect(() => {
    try {
      const name = parseCharacter(def).name;
      setValidation({ valid: true, error: "", name });
    } catch (ex) {
      setValidation({ valid: false, error: (ex as Error).message, name: "" });
    }
  }, [def]);

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      setDef(evt.target.value);
    },
    [setDef]
  );

  const copyButtons = useMemo(() => {
    if (!validation.valid) return null;
    return (
      <>
        Copy:
        <CopyButton text={def}>text</CopyButton>
        <CopyButton text={getShareLink(def)}>link (raw)</CopyButton>
        <CopyButton text={getMarkdownShareLink(validation.name, def)}>
          link (markdown)
        </CopyButton>
      </>
    );
  }, [def, validation]);

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
        <Validator $valid={validation.valid}>
          {validation.valid ? (
            <ValidLine>
              <CheckCircle color={colors.green} />
              <FlexSpacer />
              {copyButtons}
            </ValidLine>
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
