import React from "react";
import { Panel, Window, View } from "./dockable";

export type ParsedNode = LayoutNode;

type ViewId = string;

export type WindowNode = {
  type: "Window";
  tabs: ViewId[];
  size?: number;
};

export type PanelNode = {
  type: "Panel";
  orientation?: "row" | "column";
  panels: LayoutNode[];
  size?: number;
};

export type LayoutNode = PanelNode | WindowNode;

import type { PanelProps, WindowProps, ViewProps } from "./dockable";

function serializeLayout(
  element: React.ReactElement,
  views: React.ReactElement[]
): ParsedNode {
  if (!React.isValidElement(element)) {
    console.log(element);
    throw new Error("Invalid element");
  }

  // Handle <Panel>
  if (element.type === Panel) {
    const props = element.props as PanelProps;
    const orientation = props.orientation;
    // if (orientation !== "row" && orientation !== "column") {
    //   throw new Error(`Panel must have orientation 'row' or 'column'`);
    // }

    const children = React.Children.toArray(
      props.children
    ) as React.ReactElement[];
    const parsedChildren = children.map((child) =>
      serializeLayout(child, views)
    );

    for (const child of parsedChildren) {
      if (child.type !== "Panel" && child.type !== "Window") {
        throw new Error("Panels can only contain other Panels or Windows");
      }
    }

    return {
      type: "Panel",
      orientation,
      panels: parsedChildren,
      size: props.size || 1,
    };
  }

  // Handle <Window>
  if (element.type === Window) {
    const props = element.props as WindowProps;
    const children = React.Children.toArray(
      props.children
    ) as React.ReactElement[];

    const tabIds = children.map(parseView);

    return {
      type: "Window",
      tabs: tabIds,
      size: props.size || 1,
    };
  }

  // automatically wrap a <View> in a <Window> if it is not already a <Window>
  if (element.type === View) {
    return {
      type: "Window",
      tabs: [parseView(element)],
      size: 1,
    };
  }

  function parseView(child: React.ReactElement): string {
    if (!React.isValidElement(child) || child.type !== View) {
      throw new Error("Windows can only contain <View> elements");
    }

    const childProps = child.props as ViewProps;

    const viewId = childProps.id;
    if (typeof viewId !== "string") {
      throw new Error("Each <View> must have an 'id' prop");
    }

    views.push(child);

    return viewId;
  }

  throw new Error(`Unknown component: ${element.type}`);
}

export default serializeLayout;
