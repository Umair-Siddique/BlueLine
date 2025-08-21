import React from "react";
import InputArea from "./InputArea";
import MessageWindow from "./MessageWindow";
import ChatHeader from "./ChatHeader";

const ChatBox = ({
  input,
  handleKeyDown,
  handleInputChange,
  handleSendClick,
  messages,
  currentModel,
  showModelSelector,
  setShowModelSelector,
  onModelChange,
  availableModels,
}) => {
  return (
    <div className={`flex flex-col flex-1`}>
          <ChatHeader
            currentModel={currentModel}
            showModelSelector={showModelSelector}
            setShowModelSelector={setShowModelSelector}
            onModelChange={onModelChange}
            availableModels={availableModels}
          />

          <MessageWindow
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            handleSendClick={handleSendClick}
          />

          <InputArea
            input={input}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            handleSendClick={handleSendClick}
          />
    </div>
  );
};

export default ChatBox;