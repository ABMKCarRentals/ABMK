import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "default" | "large";
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "default",
  text = "Loading...",
}) => {
  const sizeClasses: Record<"small" | "default" | "large", string> = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-yellow-600 mb-4`}
      ></div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
