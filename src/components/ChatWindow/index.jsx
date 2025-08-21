import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import { API_URL } from "../../constants";
import MessageWindow from "./ChatBox/MessageWindow";
import InputArea from "./ChatBox/InputArea";
import ChatHeader from "./ChatBox/ChatHeader";

// Available AI models
const AI_MODELS = [
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    description: "Default - Balanced performance",
  },
  {
    id: "llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout",
    description: "Open source alternative",
  },
  {
    id:"mistral-large-latest",
    name: "Mistral Large",
    description: "Mistral's latest model",
  },
];

const ChatWindow = ({ activeId, shouldFetchMessages = false }) => {
  const [input, setInput] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    "claude-sonnet-4-20250514"
  );
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [messages, setMessages] = useState([]);
  const [streamingAiResponseText, setStreamingAiResponseText] = useState("");
  const [currentStatus, setCurrentStatus] = useState(null);

  // Function to fetch messages for a specific chat
  const fetchChatMessages = async (chatId) => {
    if (!chatId) return;

    setIsLoadingMessages(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const access_token = user?.access_token;

      if (!access_token) {
        throw new Error("Access token not found. Please log in again.");
      }

      const response = await fetch(`${API_URL}/chat/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Transform the messages to match the expected format
      const transformedMessages =
        data.messages?.map((msg) => ({
          id: msg.id,
          from: msg.sender === "user" ? "user" : "ai",
          text: msg.content,
          timestamp: msg.created_at,
        })) || [];

      setMessages(transformedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(`Failed to load messages: ${error.message}`);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Modified effect - only fetch when shouldFetchMessages is true
  useEffect(() => {
    if (activeId && shouldFetchMessages) {
      fetchChatMessages(activeId);
    } else if (!activeId) {
      setMessages([]);
    }
  }, [activeId, shouldFetchMessages]);

  // Helper function to convert messages to history format for retrieval API
  const convertMessagesToHistory = (messages) => {
    return messages.map((msg) => ({
      sender: msg.from === "user" ? "user" : "ai",
      content: msg.text,
    }));
  };

  const sendRetrievalQuery = async (query) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const access_token = user?.access_token;

      if (!access_token) {
        throw new Error("Access token not found. Please log in again.");
      }

      const history = convertMessagesToHistory(messages);

      const requestPayload = {
        access_token,
        conversation_id: activeId || uuidv4(),
        query: query.trim(),
        history: history,
        model_id: selectedModel,
      };

      const response = await fetch(`${API_URL}/retriever/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream finished.");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Split into SSE messages by double newlines
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || ""; // Keep the last incomplete part in buffer

        for (const message of parts) {
          const lines = message.split("\n");
          let event = "message";
          let data = "";

          // Parse SSE format
          for (const line of lines) {
            if (line.startsWith("event:")) {
              event = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              data += (data ? "\n" : "") + line.slice(5).trim();
            }
          }

          if (!data) continue;

          try {
            // Handle different event types
            if (event === "status") {
              const statusData = JSON.parse(data);
              setCurrentStatus(statusData);
              console.log("Status:", statusData);
            } else if (event === "token") {
              const tokenData = JSON.parse(data);
              accumulatedAnswer += tokenData;
              setStreamingAiResponseText(accumulatedAnswer);
            } else if (event === "done") {
              const doneData = JSON.parse(data);
              console.log("Stream complete:", doneData);
              setCurrentStatus(null);
            }
          } catch (parseError) {
            console.error("Error parsing SSE data:", parseError, "Data:", data);
          }
        }
      }

      return { success: true, response: accumulatedAnswer };
    } catch (error) {
      console.error("Error in sendRetrievalQuery:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSendClick = async () => {
    if (!input.trim() || isSendingMessage) return;

    const userMessage = input.trim();
    setIsSendingMessage(true);
    setStreamingAiResponseText("");
    setCurrentStatus(null);

    try {
      const userMessageObj = {
        from: "user",
        text: userMessage,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessageObj]);
      setInput("");

      const apiResponse = await sendRetrievalQuery(userMessage);

      if (apiResponse.success) {
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            text: apiResponse.response,
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            isStreaming: false,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            text: `Error: ${apiResponse.error}`,
            isError: true,
            id: uuidv4(),
            timestamp: new Date().toISOString(),
          },
        ]);
        toast.error(`Failed to send message: ${apiResponse.error}`);
      }
    } catch (error) {
      console.error("Critical error in handleSendClick:", error);
      toast.error(`A critical error occurred: ${error.message}`);
    } finally {
      setIsSendingMessage(false);
      setStreamingAiResponseText("");
      setCurrentStatus(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    setShowModelSelector(false);

    const selectedModelInfo = AI_MODELS.find((model) => model.id === modelId);
    toast.success(`Switched to ${selectedModelInfo.name}`, {
      duration: 2000,
    });
  };

  const currentModel = AI_MODELS.find((model) => model.id === selectedModel);

  // Determine what to show in the streaming message
  const getStreamingDisplayText = () => {
    if (currentStatus) {
      return currentStatus; // Show status like "Retrieving from Pinecone..." or "Generating answer..."
    }
    if (streamingAiResponseText) {
      return streamingAiResponseText; // Show the actual streaming response
    }
    return "Thinking..."; // Default fallback
  };

  return (
    <div
      className="flex flex-col h-screen relative chatwindow-custom"
      style={{ background: "#fff" }}
    >
      <div className="flex-shrink-0">
        <ChatHeader
          currentModel={currentModel}
          showModelSelector={showModelSelector}
          setShowModelSelector={setShowModelSelector}
          onModelChange={handleModelChange}
          availableModels={AI_MODELS}
        />
      </div>

      <div className="flex-1 min-h-0">
        <MessageWindow
          messages={
            isSendingMessage
              ? [
                  ...messages,
                  {
                    from: "ai",
                    text: getStreamingDisplayText(),
                    id: "streaming-temp-ai",
                    isStreaming: true,
                  },
                ]
              : messages
          }
          isLoadingMessages={isLoadingMessages}
        />
      </div>

      <div className="flex-shrink-0">
        <InputArea
          input={input}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
          handleSendClick={handleSendClick}
          disabled={isSendingMessage || isLoadingMessages}
        />
      </div>

      <style>{`
        .chatwindow-custom {
          background: #fff !important;
        }
        .chatwindow-custom .message-input {
          background: #fff !important;
          color: #000 !important;
          border: 1px solid #E0E0E0 !important;
        }
        .chatwindow-custom .message-input::placeholder {
          color: #888 !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;