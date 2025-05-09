import React, { createContext, useContext } from "react";
import { ParsedNode } from "./serializeLayout";

type DockableState = {
  panels: ParsedNode[];
};

type DockableContextType = {
  state: DockableState;
  dispatch: React.Dispatch<any>;
};

export const DockableContext = createContext<DockableContextType | undefined>(
  undefined
);

export function useDockable() {
  const context = useContext(DockableContext);
  if (context === undefined) {
    throw new Error("useDockable must be used within a DockableProvider");
  }
  return context;
}
