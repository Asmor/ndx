import { useCallback, useMemo, useState } from "react";
import Button from "./Button";
import { Check, Copy } from "lucide-react";
import type { ChildProps } from "../../constants";

const iconSize = 16;

interface CopyButtonProps extends ChildProps {
  text: string;
}
export const CopyButton = ({ text, children }: CopyButtonProps) => {
  const [wasCopied, setWasCopied] = useState(false);
  const icon = useMemo(
    () => (wasCopied ? <Check size={iconSize} /> : <Copy size={iconSize} />),
    [wasCopied]
  );
  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setWasCopied(true);
      setTimeout(() => setWasCopied(false), 3000);
    } catch (ex) {
      console.error("Error copying to clipboard", { text, ex });
    }
  }, [text, setWasCopied]);
  return (
    <Button onClick={handleClick}>
      {children} {icon}
    </Button>
  );
};
