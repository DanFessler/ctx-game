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
  sourceTabId: string;
  targetWindowId: string;
};

type SplitWindowAction = {
  type: "splitWindow";
  windowId: string;
  direction: "Left" | "Right";
  sourceTabId: string;
};

type Action =
  | ResizeAction
  | AddPanelAction
  | ReorderTabsAction
  | SelectTabAction
  | MoveTabAction
  | SplitWindowAction;

const appReducer = createReducer<State, Action>({
  resize: (state, { sizes, address }: ResizeAction) => {
    function getPanels(panels: ParsedNode[], address: number[]): ParsedNode[] {
      if (address.length === 0) return panels;

      let panel: ParsedNode | ParsedNode[] = panels[address[0]];
      if (address.length > 1) {
        const innerPanels = (panel as PanelNode).children;
        panel = getPanels(innerPanels, address.slice(1));
      }

      return (panel as PanelNode).children;
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

    const activeIndex = ParentPanel.children.indexOf(activeId);
    const overIndex = ParentPanel.children.indexOf(overId);

    ParentPanel.children = arrayMove(
      ParentPanel.children,
      activeIndex,
      overIndex
    );

    ParentPanel.selected = activeId;

    console.log("ParentPanel", current(ParentPanel));
  },

  selectTab: (state, { tabId }: SelectTabAction) => {
    const ParentPanel = findTabParent(state.panels, tabId) as WindowNode;
    ParentPanel.selected = tabId;
  },

  moveTab: (state, { sourceTabId, targetWindowId }: MoveTabAction) => {
    const sourceWindow = findTabParent(state.panels, sourceTabId) as WindowNode;
    const targetWindow = findWindow(state.panels, targetWindowId) as WindowNode;

    // dont need to move it if it's the same window
    if (sourceWindow === targetWindow) return;

    const activeIndex = sourceWindow.children.indexOf(sourceTabId);
    const overIndex = targetWindow.children.length;

    // Remove tab from active parent
    sourceWindow.children.splice(activeIndex, 1);

    // Insert tab into over parent
    targetWindow.children.splice(overIndex, 0, sourceTabId);
    targetWindow.selected = sourceTabId;

    // If active tab was selected, select first remaining tab
    if (sourceWindow.selected === sourceTabId) {
      sourceWindow.selected = sourceWindow.children[0];
    }

    // clean up the tree of empty nodes
    if (sourceWindow.children.length === 0) {
      deleteEmptyNodes(state.panels);
    }
  },

  splitWindow: (
    state,
    { windowId, direction, sourceTabId }: SplitWindowAction
  ) => {
    const sourceWindow = findTabParent(state.panels, sourceTabId) as WindowNode;
    const destinationPanel = findWindowParent(
      state.panels,
      windowId
    ) as PanelNode;

    // remove tab from the source window
    const tabIndex = sourceWindow.children.findIndex(
      (child) => child === sourceTabId
    );
    sourceWindow.children.splice(tabIndex, 1);
    sourceWindow.selected = sourceWindow.children[0];

    // create new window
    const newWindow: WindowNode = {
      type: "Window",
      id: windowId + "something",
      children: [sourceTabId],
      selected: sourceTabId,
      size: 1,
    };

    // add new window to the parent panel
    destinationPanel.children.push(newWindow);

    deleteEmptyNodes(state.panels);
  },
});

function findTabParent(
  panels: ParsedNode[],
  id: string
): ParsedNode | undefined {
  for (const panel of panels) {
    if (panel.type === "Panel") {
      const innerPanels = (panel as PanelNode).children;
      const result = findTabParent(innerPanels, id);
      if (result) return result;
    }
    if (panel.type === "Window") {
      const tabs = (panel as WindowNode).children;
      const result = tabs.includes(id);
      if (result) return panel;
    }
  }
}

function findWindowParent(
  panels: ParsedNode[],
  windowId: string
): PanelNode | undefined {
  for (const panel of panels) {
    const result = panel.children.find((child) => child.id === windowId);
    if (result) return panel as PanelNode;
    if (panel.type === "Panel") {
      const innerPanels = (panel as PanelNode).children;
      const result = findWindowParent(innerPanels, windowId);
      if (result) return result;
    }
  }
}

// recursive window find
function findWindow(panels: ParsedNode[], id: string): WindowNode | undefined {
  for (const panel of panels) {
    if (panel.type === "Panel") {
      const innerPanels = (panel as PanelNode).children;
      const result = findWindow(innerPanels, id);
      if (result) return result;
    }
    if (panel.type === "Window") {
      if (panel.id === id) return panel;
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
      if (windowNode.children.length === 0) {
        root.splice(i, 1);
      }
    } else if (node.type === "Panel") {
      const panelNode = node as PanelNode;
      // Recursively process child panels
      deleteEmptyNodes(panelNode.children);

      // If panel has no children after processing, remove it
      if (panelNode.children.length === 0) {
        root.splice(i, 1);
      }
    }
  }
}

export default appReducer;
