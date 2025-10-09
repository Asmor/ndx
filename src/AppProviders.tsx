import { Provider as JotaiProvider } from "jotai";
import React, { Suspense } from "react";
import type { ChildProps } from "./constants";
import { Tooltip } from "react-tooltip";

export const AppProviders: React.FC<ChildProps> = ({ children }) => {
  return (
    <Suspense>
      <JotaiProvider>
        {children}
        <Tooltip id="tooltip" />
      </JotaiProvider>
    </Suspense>
  );
};
