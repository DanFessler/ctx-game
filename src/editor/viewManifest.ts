import Shortcuts, { shortcutsActions } from "./views/Shortcuts";
import SceneHierarchy, { SceneHierarchyActions } from "./views/Hierarchy";
import SceneCanvas, { SceneCanvasActions } from "./views/SceneCanvas";
import Inspector, { InspectorActions } from "./views/Inspector";
import AssetBrowser from "./views/AssetBrowser";

type ItemSection = {
  items: Item[] | ItemSection[];
};

type Item = {
  label: string;
  onClick: () => void;
  shortcut?: string;
  items?: Item[];
};

type Actions = ItemSection[];

type ViewType = {
  name: string;
  component: React.ComponentType;
  actions?: Actions;
};

export const viewManifest: Record<string, ViewType> = {
  shortcuts: {
    name: "Shortcuts",
    component: Shortcuts,
    actions: shortcutsActions,
  },
  hierarchy: {
    name: "Hierarchy",
    component: SceneHierarchy,
    actions: SceneHierarchyActions,
  },
  scene1: {
    name: "Scene",
    component: SceneCanvas,
    actions: SceneCanvasActions,
  },
  inspector: {
    name: "Inspector",
    component: Inspector,
    actions: InspectorActions,
  },
  assets: { name: "Assets", component: AssetBrowser },
};
