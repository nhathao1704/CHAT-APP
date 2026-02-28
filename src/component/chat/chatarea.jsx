import ChatHeader from "./chatheader";
import MessageList from "./messagelist";
import MessageInput from "./messageinput";

const ChatArea = () => {
  return (
    <div className="chat-area">
      <ChatHeader name="Chloe Adams" />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatArea;