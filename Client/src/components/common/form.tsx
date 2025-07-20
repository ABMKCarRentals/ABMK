import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { AlertCircle, Check } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  className = "",
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    const isRequired = getControlItem.required || false;
    const hasError = isRequired && !value;

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="relative">
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={`
                bg-gray-800 border-gray-600 text-white placeholder-gray-400
                focus:border-yellow-500 focus:ring-yellow-500/20 focus:ring-2 focus:outline-none
                transition-all duration-200 ease-in-out
                px-4 py-3 rounded-lg
                ${
                  hasError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }
                ${value && !hasError ? "border-green-500" : ""}
              `}
            />
            {value && !hasError && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
            {hasError && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
            )}
          </div>
        );
        break;

      case "select":
        element = (
          <div className="relative">
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={value}
            >
              <SelectTrigger
                className={`
                  bg-gray-800 border-gray-600 text-white
                  focus:border-yellow-500 focus:ring-yellow-500/20 focus:ring-2 focus:outline-none
                  transition-all duration-200 ease-in-out
                  px-4 py-3 rounded-lg h-12
                  ${
                    hasError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }
                  ${value && !hasError ? "border-green-500" : ""}
                `}
              >
                <SelectValue
                  placeholder={
                    getControlItem.placeholder || getControlItem.label
                  }
                  className="text-gray-400"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60 overflow-y-auto">
                {getControlItem.options.map((optionItem) => (
                  <SelectItem
                    key={optionItem.id}
                    value={optionItem.id}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer py-3 px-4"
                  >
                    {optionItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {value && !hasError && (
              <Check className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
            )}
            {hasError && (
              <AlertCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500 pointer-events-none" />
            )}
          </div>
        );
        break;

      case "textarea":
        element = (
          <div className="relative">
            <Textarea
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={`
                bg-gray-800 border-gray-600 text-white placeholder-gray-400
                focus:border-yellow-500 focus:ring-yellow-500/20 focus:ring-2 focus:outline-none
                transition-all duration-200 ease-in-out
                px-4 py-3 rounded-lg min-h-[100px] resize-vertical
                ${
                  hasError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }
                ${value && !hasError ? "border-green-500" : ""}
              `}
            />
            {value && !hasError && (
              <Check className="absolute right-3 top-3 w-4 h-4 text-green-500" />
            )}
            {hasError && (
              <AlertCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
            )}
          </div>
        );
        break;

      default:
        element = (
          <div className="relative">
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={`
                bg-gray-800 border-gray-600 text-white placeholder-gray-400
                focus:border-yellow-500 focus:ring-yellow-500/20 focus:ring-2 focus:outline-none
                transition-all duration-200 ease-in-out
                px-4 py-3 rounded-lg
                ${
                  hasError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }
                ${value && !hasError ? "border-green-500" : ""}
              `}
            />
            {value && !hasError && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
            {hasError && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formControls.map((controlItem) => {
            const isRequired = controlItem.required || false;
            const isFullWidth =
              controlItem.fullWidth ||
              controlItem.componentType === "textarea" ||
              controlItem.name === "description" ||
              controlItem.name === "metaDescription" ||
              controlItem.name === "metaTitle";

            return (
              <div
                className={`space-y-2 ${isFullWidth ? "md:col-span-2" : ""}`}
                key={controlItem.name}
              >
                <Label
                  htmlFor={controlItem.name}
                  className="text-sm font-medium text-gray-200 flex items-center gap-2"
                >
                  {controlItem.label}
                  {isRequired && (
                    <span className="text-red-400 text-xs">*</span>
                  )}
                  {controlItem.tooltip && (
                    <span className="text-gray-400 text-xs">
                      ({controlItem.tooltip})
                    </span>
                  )}
                </Label>
                {renderInputsByComponentType(controlItem)}
                {controlItem.description && (
                  <p className="text-xs text-gray-400 mt-1">
                    {controlItem.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            onClick={() => {
              // Reset form or close modal logic can be added here
              const resetData = {};
              formControls.forEach((control) => {
                resetData[control.name] = "";
              });
              setFormData(resetData);
            }}
          >
            Reset
          </Button>
          <Button
            disabled={isBtnDisabled}
            type="submit"
            className={`
              px-8 py-2 font-medium rounded-lg transition-all duration-200
              ${
                isBtnDisabled
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }
            `}
          >
            {isBtnDisabled ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              buttonText || "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CommonForm;
