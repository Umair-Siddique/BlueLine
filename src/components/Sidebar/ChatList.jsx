import ChatGroup from "./ChatGroup";
import EmptyState from "./EmptyState";

const ChatList = ({
  groupedChats,
  activeId,
  onChatClick,
  onDeleteChat,
  isLoadingChats,
  searchTerm,
  onRefreshChats,
}) => {
  if (isLoadingChats) {
    return <EmptyState type="loading" />;
  }

  if (Object.keys(groupedChats).length === 0 && !searchTerm) {
    return <EmptyState type="no-chats" onRefresh={onRefreshChats} />;
  }

  if (Object.keys(groupedChats).length === 0 && searchTerm) {
    return <EmptyState type="no-search-results" />;
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedChats).map(([timeLabel, chats]) => (
        <ChatGroup
          key={timeLabel}
          timeLabel={timeLabel}
          chats={chats}
          activeId={activeId}
          onChatClick={onChatClick}
          onDeleteChat={onDeleteChat}
        />
      ))}
    </div>
  );
};

export default ChatList;
