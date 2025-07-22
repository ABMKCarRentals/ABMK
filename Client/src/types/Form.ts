export type FormControl = {
  label: string;
  name: string;
  componentType: "input" | "select" | "textarea" | "switch" | "multiselect";
  type?: string;
  placeholder?: string;
  options?: { id: string; label: string }[];
  min?: number;
  max?: number;
  defaultValue?: string | number | boolean | string[];
  rows?: number;
  maxLength?: number;
  description?: string;
};
