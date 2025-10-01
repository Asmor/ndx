import { Provider as JotaiProvider } from "jotai";
import React from "react";
import type { ChildProps } from "./constants";
import { Tooltip } from "react-tooltip";

export const AppProviders: React.FC<ChildProps> = ({ children }) => {
  return (
    <JotaiProvider>
      {children}
      <Tooltip id="tooltip" />
    </JotaiProvider>
  );
};
