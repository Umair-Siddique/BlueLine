import { MessageCircle } from "lucide-react";
import React from "react";

const EmptyState = ({ isProjectChat }) => (
  <div className="flex-1 flex items-center justify-center p-4 md:p-8">
    <div className="text-center max-w-2xl mx-auto">
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-700/50">
        {/* Icon Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-full blur-lg opacity-30 animate-pulse" />
          <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <MessageCircle size={40} className="text-white drop-shadow-sm" />
          </div>
        </div>

        {/* Header */}
        {!isProjectChat ? (
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Please select a project to start conversing with Binkr Daita.
          </h1>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              How can I help you today?
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Ask me anything about your uploaded documents! I can help analyze,
              summarize, and answer questions based on your project files.{" "}
            </p>
          </>
        )}
      </div>
    </div>
  </div>
);

export default EmptyState;
