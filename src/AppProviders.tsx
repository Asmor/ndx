import "./Theme.scss";
import "./App.scss";
import { Provider as JotaiProvider } from "jotai";
import React, { Suspense } from "react";
import type { ChildProps } from "./constants";
import { Tooltip } from "react-tooltip";
import { HashRouter } from "react-router";

export const AppProviders: React.FC<ChildProps> = ({ children }) => {
  return (
    <HashRouter>
      <Suspense>
        <JotaiProvider>
          {children}
          <Tooltip id="tooltip" />
        </JotaiProvider>
      </Suspense>
    </HashRouter>
  );
};
