import React from "react";

export function LoadingSpinner({ size = 28 }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
