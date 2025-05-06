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

    function getPanels(panels: ParsedNode[], address: number[]) {
      if (address.length === 0) return panels;

      let panel = panels[address[0]] as PanelNode;
      if (address.length > 1) {
        panel = getPanels(panel.panels, address.slice(1));
      }

      return panel.panels;
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
