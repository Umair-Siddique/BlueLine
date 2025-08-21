import React, { useState } from "react";

const NewChatModal = ({ show, onClose, onConfirm, isLoading }) => {
  const [chatName, setChatName] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatName.trim()) {
      onConfirm(chatName.trim());
      setChatName("");
    }
  };
  
  const handleClose = () => {
    setChatName("");
    onClose();
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="rounded-lg p-6 w-96 max-w-full mx-4"
        style={{ backgroundColor: '#1F1F1F' }}
      >
        <h2 
          className="text-lg font-semibold mb-4"
          style={{ color: '#E0E0E0' }}
        >
          Create New Chat
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="chatName"
              className="block text-sm font-medium mb-2"
              style={{ color: '#E0E0E0' }}
            >
              Chat Name
            </label>
            <input
              id="chatName"
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter chat name..."
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{
                backgroundColor: '#1F1F1F',
                border: '1px solid #5BC0EB',
                color: '#E0E0E0',
                '--tw-ring-color': '#00C2A8'
              }}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-md disabled:opacity-50 transition-colors"
              style={{
                border: '1px solid #5BC0EB',
                color: '#E0E0E0',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#5BC0EB';
                  e.target.style.color = '#1F1F1F';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#E0E0E0';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!chatName.trim() || isLoading}
              className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                backgroundColor: '#fff',
                color: '#000',
                border: '1px solid #1E1E1E'
              }}
            >
              {isLoading ? "Creating..." : "Create Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;