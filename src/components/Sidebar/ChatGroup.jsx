import ChatListItem from "./ChatListItem";

const ChatGroup = ({
  timeLabel,
  chats,
  activeId,
  onChatClick,
  onDeleteChat,
}) => {
  return (
    <div className="px-4">
      <h3
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: "#E0E0E0" }}
      >
        {timeLabel}
      </h3>
      <div className="space-y-1">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chatId={chat.id}
            title={chat.title}
            chat={chat}
            activeId={activeId}
            onChatClick={onChatClick}
            onDeleteChat={onDeleteChat}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatGroup;
