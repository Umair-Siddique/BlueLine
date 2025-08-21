import { useState, useRef, useEffect } from "react";
import { Upload, X, FileText, AlertCircle, ChevronDown } from "lucide-react";

const UploadDocumentModal = ({ show, onClose, onSubmit, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState("common");
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const documentTypes = [
    { value: "common", label: "Common" },
    { value: "brand-positioning", label: "Brand Positioning" },
    { value: "insights", label: "Insights" },
    { value: "events", label: "Events" }
  ];

  const handleFileSelect = (file) => {
    if (file && (file.type === "text/plain" || file.name.endsWith('.txt'))) {
      setSelectedFile(file);
    } else {
      alert("Please select a text file (.txt)");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && selectedType) {
      onSubmit(selectedFile, selectedType);
      setSelectedFile(null);
      setSelectedType("brand-positioning");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedType("brand-positioning");
    setDragActive(false);
    setShowDropdown(false);
    onClose();
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  // Add event listener for outside clicks
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [showDropdown]);

  const selectedTypeLabel = documentTypes.find(type => type.value === selectedType)?.label || "Select Type";

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Upload Document</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Document Type Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Document Type
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-left text-black hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span>{selectedTypeLabel}</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform text-gray-500 ${showDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {documentTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeSelect(type.value)}
                      className={`w-full px-3 py-2 text-left text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors ${
                        selectedType === type.value ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Select File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-black bg-black bg-opacity-5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-2 text-black">
                  <FileText size={20} className="text-green-600" />
                  <span className="text-sm truncate max-w-48 font-medium">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={32} className="mx-auto text-gray-500" />
                  <p className="text-black text-sm">
                    Drag and drop a text file here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-black underline hover:no-underline"
                      disabled={isLoading}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Only .txt files are supported
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Info Message */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertCircle
                size={16}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <p className="text-blue-800 text-sm">
                This document will be uploaded as a <strong>{selectedTypeLabel}</strong> document
                and will be available for all users.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || !selectedType || isLoading}
              className="px-4 py-2 bg-black  !text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="!text-white">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} color="#fff" />
                  <span className="!text-white">Upload</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;