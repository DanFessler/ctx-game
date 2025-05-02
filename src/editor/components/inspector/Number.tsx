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
        // @ts-expect-error if I dont send a string, react will keep leading zeroes
        onChange={(e) => onChange(Number(e.target.value).toString())}
        style={{ width: "100%", boxSizing: "border-box", gridColumn: "span 2" }}
      />
    </>
  );
}

export default NumberInput;
