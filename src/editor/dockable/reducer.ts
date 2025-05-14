import createReducer from "./utils/createReducer";
import { ParsedNode, PanelNode, WindowNode } from "./serializeLayout";
// import { current } from "immer";
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
  sourceTabId: string;
  targetTabId: string;
  address: number[];
};

type SelectTabAction = {
  type: "selectTab";
  tabId: string;
  address: number[];
};

type MoveTabAction = {
  type: "moveTab";
  tabId: string;
  sourceWindowAddress: number[];
  targetWindowAddress: number[];
};

type SplitWindowAction = {
  type: "splitWindow";
  tabId: string;
  sourceWindowAddress: number[];
  targetWindowAddress: number[];
  direction: "Left" | "Right" | "Top" | "Bottom";
  orientation: "row" | "column";
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
    const children = getNodeFromAddress(state.panels, address)
      .children as PanelNode[];

    // update the size of the panels
    children.forEach((p, i) => {
      p.size = sizes[i];
    });
  },

  addPanel: (state, { panel }: AddPanelAction) => {
    state.panels.push(panel);
  },

  reorderTabs: (
    state,
    { sourceTabId, targetTabId, address }: ReorderTabsAction
  ) => {
    const ParentPanel = getNodeFromAddress(state.panels, address) as WindowNode;
    const activeIndex = ParentPanel.children.indexOf(sourceTabId);
    const overIndex = ParentPanel.children.indexOf(targetTabId);
    ParentPanel.selected = sourceTabId;
    ParentPanel.children = arrayMove(
      ParentPanel.children,
      activeIndex,
      overIndex
    );
  },

  selectTab: (state, { tabId, address }: SelectTabAction) => {
    const ParentPanel = getNodeFromAddress(state.panels, address) as WindowNode;
    ParentPanel.selected = tabId;
  },

  moveTab: (
    state,
    { tabId, sourceWindowAddress, targetWindowAddress }: MoveTabAction
  ) => {
    const sourceWindow = getNodeFromAddress(
      state.panels,
      sourceWindowAddress
    ) as WindowNode;
    const targetWindow = getNodeFromAddress(
      state.panels,
      targetWindowAddress
    ) as WindowNode;

    // dont need to move it if it's the same window
    if (sourceWindow === targetWindow) return;

    const activeIndex = sourceWindow.children.indexOf(tabId);
    const overIndex = targetWindow.children.length; // always the last tab

    // Remove tab from active parent
    sourceWindow.children.splice(activeIndex, 1);

    // Insert tab into over parent
    targetWindow.children.splice(overIndex, 0, tabId);
    targetWindow.selected = tabId;

    // If active tab was selected, select first remaining tab
    if (sourceWindow.selected === tabId) {
      sourceWindow.selected = sourceWindow.children[0];
    }

    // clean up the tree of empty nodes
    if (sourceWindow.children.length === 0) {
      deleteEmptyNodes(state.panels);
    }
  },

  splitWindow: (
    state,
    {
      tabId,
      sourceWindowAddress,
      targetWindowAddress,
      direction,
      orientation,
    }: SplitWindowAction
  ) => {
    const sourceWindow = getNodeFromAddress(
      state.panels,
      sourceWindowAddress
    ) as WindowNode;

    const targetWindow = getNodeFromAddress(
      state.panels,
      targetWindowAddress
    ) as WindowNode;

    const targetPanel = getNodeFromAddress(
      state.panels,
      targetWindowAddress.slice(0, -1)
    ) as PanelNode;

    const targetWindowIndex = targetWindowAddress.slice(-1)[0];

    // if the source window is the same as the target window and the source window has only one tab, we don't need to do anything
    if (sourceWindow === targetWindow && sourceWindow.children.length === 1) {
      return;
    }

    // remove tab from the source window
    const tabIndex = sourceWindow.children.indexOf(tabId);
    sourceWindow.children.splice(tabIndex, 1);

    // select the first tab in the window since we (likely) removed the selected tab
    sourceWindow.selected = sourceWindow.children[0];

    // create new window
    const newWindow: WindowNode = {
      type: "Window",
      id: "window-" + Date.now(),
      children: [tabId],
      selected: tabId,
      size: 1,
    };

    const isAligned =
      (orientation === "row" && ["Left", "Right"].includes(direction)) ||
      (orientation === "column" && ["Top", "Bottom"].includes(direction));

    // if the split direction is aligned with the parent panel, we only need to insert into the panel's children
    if (isAligned) {
      const offset = direction === "Left" ? 0 : 1;
      targetPanel.children.splice(targetWindowIndex + offset, 0, newWindow);
    }

    // otherwise we need to encapsulate the target window and source window in a new panel with a new orientation
    if (!isAligned) {
      const shouldReverse = direction === "Left" || direction === "Top";
      const newPanel: PanelNode = {
        type: "Panel",
        id: "panel-" + Date.now(),
        children: shouldReverse
          ? [newWindow, targetWindow]
          : [targetWindow, newWindow],
      };
      targetPanel.children[targetWindowIndex] = newPanel;
    }

    deleteEmptyNodes(state.panels);
  },
});

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

function getNodeFromAddress(
  panels: ParsedNode[],
  address: number[]
): ParsedNode {
  // if the address is empty, we create a "root" panel
  // because it doesn't really exist in the tree
  if (address.length === 0)
    return {
      id: "root",
      type: "Panel",
      children: panels,
      size: 1,
    };

  // if the address has only one element, we return the panel at that index
  if (address.length === 1) return panels[address[0]];

  // otherwise, we get the children of the panel at the first address index
  // and recursively call the function, slicing off the first index each time
  const children = panels[address[0]].children;
  return getNodeFromAddress(children as ParsedNode[], address.slice(1));
}

export default appReducer;
