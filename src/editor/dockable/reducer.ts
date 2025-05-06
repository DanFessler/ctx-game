import createReducer from "./utils/createReducer";
import { ParsedNode, PanelNode } from "./serializeLayout";

type State = {
  panels: ParsedNode[];
};

type ResizeAction = {
  type: "resize";
  sizes: number[];
  address: number[];
};

type AddPanelAction = {
  type: "addPanel";
  panel: ParsedNode;
};

type Action = ResizeAction | AddPanelAction;

const appReducer = createReducer<State, Action>({
  resize: (state, { sizes, address }: ResizeAction) => {
    console.log("RESIZE!!!", sizes, address);

    function getPanels(panels: ParsedNode[], address: number[]): ParsedNode[] {
      if (address.length === 0) return panels;

      let panel: ParsedNode | ParsedNode[] = panels[address[0]];
      if (address.length > 1) {
        const innerPanels = (panel as PanelNode).panels;
        panel = getPanels(innerPanels, address.slice(1));
      }

      return (panel as PanelNode).panels;
    }

    // get the panels at the address
    const panel = getPanels(state.panels, address);

    // update the size of the panels
    panel.forEach((p: ParsedNode, i: number) => {
      p.size = sizes[i];
    });
  },

  addPanel: (state, { panel }: AddPanelAction) => {
    state.panels.push(panel);
  },
});

export default appReducer;
