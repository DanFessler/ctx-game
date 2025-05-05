import Panel from "./PanelView";

type DockableProps = {
  orientation: "row" | "column";
  panels: panelObject[];
  children: React.ReactNode;
};

export type panelObject =
  | { size?: number; tabs: string[] }
  | { size?: number; panels: panelObject[] };

function Dockable({ orientation = "row", panels, children }: DockableProps) {
  const views = [];
  const panels = [];

  let parentType = "Panel";
  function parseNodeTree(element: React.ReactElement) {
    if (typeof element !== "object" || element === null) return null;

    const { type } = element;

    let node;
    switch (parentType) {
      case "Panel":
        {
          if (type !== "Panel" && type !== "Window") {
            throw new Error("Invalid element type");
          }
          const { props } = element;

          if (type === "Panel") {
            const panelProps = element.props as PanelProps;
            node = {
              size: panelProps.size || 1,
            };
          }
        }
        break;
      case "Window":
        break;
      case "View":
        break;
    }

    const node = {
      type: typeof type === "string" ? type : type.name || "Unknown",
      id: props.id,
      direction: props.direction,
      title: props.title,
      children: [],
    };

    const children = React.Children.toArray(props.children);
    for (const child of children) {
      const parsed = parseNodeTree(child);
      if (parsed) node.children.push(parsed);
    }

    return node;
  }

  return (
    <Panel orientation={orientation} panels={panels}>
      {children}
    </Panel>
  );
}

type PanelProps = {
  orientation: "row" | "column";
  size?: number;
  panels: panelObject[];
  children: React.ReactNode;
};

type WindowProps = {
  children: React.ReactNode;
};

type ViewProps = {
  id: string;
  name: string;
  children: React.ReactNode;
};

export default Dockable;
