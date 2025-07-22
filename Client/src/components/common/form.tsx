import React, { useState } from "react";
import type { FormControl } from "@/types/Form";
import { Button } from "@/components/ui/button";

interface FormProps {
  formControls: FormControl[];
  onSubmit: (data: Record<string, any>) => void;
}

const Form: React.FC<FormProps> = ({ formControls, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: any = value;

    // Only access checked for checkboxes/radios
    if (type === "checkbox" || type === "radio") {
      // TypeScript knows e.target is HTMLInputElement if type is checkbox or radio
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      parsedValue = value === "" ? "" : parseFloat(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  // Helper for defaultValue type compatibility
  function getDefaultValue(
    control: FormControl
  ): string | number | readonly string[] | undefined {
    if (control.defaultValue === undefined || control.defaultValue === null) {
      return undefined;
    }
    // If it's boolean, convert to string for inputs/selects
    if (typeof control.defaultValue === "boolean") {
      return control.defaultValue ? "true" : "false";
    }
    // If it's array, ensure it's a string[]
    if (Array.isArray(control.defaultValue)) {
      return control.defaultValue.map(String);
    }
    return control.defaultValue as string | number;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      {formControls.map((control) => (
        <div key={control.name} className="flex flex-col gap-2">
          <label className="text-sm font-medium">{control.label}</label>
          {control.componentType === "input" && (
            <input
              type={control.type || "text"}
              name={control.name}
              placeholder={control.placeholder}
              min={control.min}
              max={control.max}
              defaultValue={getDefaultValue(control)}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          )}
          {control.componentType === "textarea" && (
            <textarea
              name={control.name}
              placeholder={control.placeholder}
              rows={control.rows || 3}
              defaultValue={
                typeof control.defaultValue === "boolean"
                  ? control.defaultValue
                    ? "true"
                    : "false"
                  : Array.isArray(control.defaultValue)
                  ? control.defaultValue.join(", ")
                  : (control.defaultValue as string | number | undefined)
              }
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          )}
          {control.componentType === "select" && control.options && (
            <select
              name={control.name}
              defaultValue={
                typeof control.defaultValue === "boolean"
                  ? control.defaultValue
                    ? "true"
                    : "false"
                  : Array.isArray(control.defaultValue)
                  ? control.defaultValue[0] ?? ""
                  : (control.defaultValue as string | number | undefined) ?? ""
              }
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value="" disabled>
                {control.placeholder || "Select an option"}
              </option>
              {control.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {/* If you implement switch/multiselect, add components here */}
        </div>
      ))}
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default Form;
