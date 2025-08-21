import React, { memo, useMemo } from "react";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";

const MessageItem = memo(({ messages, msg, index }) => {
  // Handle both live message format and persisted message format
  const messageId = msg.id || msg.message_id;
  const sender = msg.from || msg.sender;
  const content = msg.text || msg.content;
  const createdAt = msg.timestamp || msg.created_at;

  const isUser = sender === "user";

  // Normalize the message object for MessageBubble
  const normalizedMsg = useMemo(
    () => ({
      id: messageId,
      from: sender,
      text: content,
      timestamp: createdAt,
    }),
    [messageId, sender, content, createdAt]
  );

  // Determine if this is the first AI response in the conversation
  const isFirstAIResponse = useMemo(() => {
    const firstSender = messages[0]?.from || messages[0]?.sender;
    return index === 1 && firstSender === "user" && sender === "ai";
  }, [index, messages, sender]);

  // Format the timestamp
  const timestamp = useMemo(() => {
    if (!createdAt) return "";

    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [createdAt]);

  // Don't render if this message has an error flag
  if (msg.isError) {
    return null;
  }

  // AI avatar (left side)
  const aiAvatar = !isUser && (
    <div className="flex-shrink-0 mt-1 mr-3 md:mr-4">
      <div className="relative">
        <Avatar from={sender} />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full" />
      </div>
    </div>
  );

  // User avatar (right side)
  const userAvatar = isUser && (
    <div className="flex-shrink-0 mt-1 ml-3">
      <Avatar from={sender} />
    </div>
  );

  return (
    <div
      key={messageId}
      className={`flex group animate-fade-in ${
        isUser ? "justify-end pl-8 md:pl-16" : "justify-start pr-8 md:pr-16"
      }`}
    >
      {/* AI Avatar */}
      {aiAvatar}

      {/* Message Content */}
      <div
        className={`flex flex-col max-w-[75%] md:max-w-[90%] ${
          isUser ? "items-end ml-auto" : "items-start mr-auto"
        }`}
      >
        <MessageBubble
          msg={normalizedMsg}
          isUser={isUser}
          isFirstAIResponse={isFirstAIResponse}
        />

        {/* Timestamp */}
        {timestamp && (
          <div
            className={`flex items-center gap-2 mt-2 text-xs text-gray-400 ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <time>{timestamp}</time>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {userAvatar}
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export default MessageItem;
