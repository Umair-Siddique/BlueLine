import React from "react";

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 z-50">
    <div className="text-center">
      <svg
        className="animate-spin h-12 w-12 text-blue-600 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="mt-4 text-lg font-medium text-white">Loading...</p>
    </div>
  </div>
);

export default LoadingScreen;
