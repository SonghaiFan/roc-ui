import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../registry/roc/select";

/** One-of-many choice built from ROC Select; replaces the browser's native menu. */
export function Picker({
  value,
  onValueChange,
  options,
  label,
  className,
  dark,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label?: string }[];
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={label} size="sm" className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className={dark ? "picker-content picker-dark" : "picker-content"}
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label ?? option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
