import createReducer from "./utils/createReducer";
import { ParsedNode, PanelNode, WindowNode } from "./serializeLayout";
import { current } from "immer";
import { arrayMove } from "@dnd-kit/sortable";

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

type ReorderTabsAction = {
  type: "reorderTabs";
  activeId: string;
  overId: string;
};

type SelectTabAction = {
  type: "selectTab";
  tabId: string;
};

type MoveTabAction = {
  type: "moveTab";
  activeId: string;
  overId: string;
};

type Action =
  | ResizeAction
  | AddPanelAction
  | ReorderTabsAction
  | SelectTabAction
  | MoveTabAction;

const appReducer = createReducer<State, Action>({
  resize: (state, { sizes, address }: ResizeAction) => {
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

  reorderTabs: (state, { activeId, overId }: ReorderTabsAction) => {
    const ParentPanel = findTabParent(state.panels, activeId) as WindowNode;

    const activeIndex = ParentPanel.tabs.indexOf(activeId);
    const overIndex = ParentPanel.tabs.indexOf(overId);

    ParentPanel.tabs = arrayMove(ParentPanel.tabs, activeIndex, overIndex);

    ParentPanel.selected = activeId;

    console.log("ParentPanel", current(ParentPanel));
  },

  selectTab: (state, { tabId }: SelectTabAction) => {
    const ParentPanel = findTabParent(state.panels, tabId) as WindowNode;
    ParentPanel.selected = tabId;
  },

  moveTab: (state, { activeId, overId }: MoveTabAction) => {
    const ActiveParentPanel = findTabParent(
      state.panels,
      activeId
    ) as WindowNode;
    const OverParentPanel = findTabParent(state.panels, overId) as WindowNode;

    if (ActiveParentPanel === OverParentPanel) {
      return;
    }

    const activeIndex = ActiveParentPanel.tabs.indexOf(activeId);
    const overIndex = OverParentPanel.tabs.indexOf(overId);

    // Remove tab from active parent
    ActiveParentPanel.tabs.splice(activeIndex, 1);

    // Insert tab into over parent
    OverParentPanel.tabs.splice(overIndex, 0, activeId);

    // If active tab was selected, select first remaining tab
    if (ActiveParentPanel.selected === activeId) {
      ActiveParentPanel.selected = ActiveParentPanel.tabs[0];
    }

    // clean up the tree of empty nodes
    if (ActiveParentPanel.tabs.length === 0) {
      deleteEmptyNodes(state.panels);
    }
  },
});

function findTabParent(
  panels: ParsedNode[],
  id: string
): ParsedNode | undefined {
  for (const panel of panels) {
    if (panel.type === "Panel") {
      const innerPanels = (panel as PanelNode).panels;
      const result = findTabParent(innerPanels, id);
      if (result) return result;
    }
    if (panel.type === "Window") {
      const tabs = (panel as WindowNode).tabs;
      const result = tabs.includes(id);
      if (result) return panel;
    }
  }
}

function deleteEmptyNodes(root: ParsedNode[]) {
  // Process nodes in reverse order to avoid index shifting issues
  for (let i = root.length - 1; i >= 0; i--) {
    const node = root[i];

    if (node.type === "Window") {
      const windowNode = node as WindowNode;
      // If window has no tabs, remove it
      if (windowNode.tabs.length === 0) {
        root.splice(i, 1);
      }
    } else if (node.type === "Panel") {
      const panelNode = node as PanelNode;
      // Recursively process child panels
      deleteEmptyNodes(panelNode.panels);

      // If panel has no children after processing, remove it
      if (panelNode.panels.length === 0) {
        root.splice(i, 1);
      }
    }
  }
}

export default appReducer;
