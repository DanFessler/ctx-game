import defaultActions from "../defaultActions";

export const shortcutsActions = [
  ...defaultActions,
  {
    items: [
      {
        label: "Test Action",
        onClick: () => {},
        shortcut: "⌘+S",
      },
    ],
  },
];

function Shortcuts() {
  return <div className="shortcuts">test shortcut</div>;
}

export default Shortcuts;
