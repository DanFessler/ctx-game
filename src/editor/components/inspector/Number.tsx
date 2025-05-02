type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function NumberInput({ label, value, onChange }: NumberInputProps) {
  return (
    <>
      <label>{label}</label>
      <input
        type="number"
        value={value as number}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", boxSizing: "border-box", gridColumn: "span 2" }}
      />
    </>
  );
}

export default NumberInput;
