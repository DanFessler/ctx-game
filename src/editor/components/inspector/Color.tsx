type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <>
      <label>{label}</label>
      <input
        type="color"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", gridColumn: "span 2" }}
      />
    </>
  );
}

export default ColorInput;
