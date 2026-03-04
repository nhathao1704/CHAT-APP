import ChatHeader from "./chatheader";
import MessageList from "./messagelist";
import MessageInput from "./messageinput";

const ChatArea = ({ friend }) => {
  const userId = localStorage.getItem("userId");
  if (!friend) {
    return (
      <div className="chat-area" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <p>Zola xin chào bạn</p>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <ChatHeader name={friend.username || friend.name} avatar={friend.avatar} />
       <MessageList
          conversationId={friend.conversationId}
          currentUserId={userId}
        />
        <MessageInput
          conversationId={friend.conversationId}
           userId={userId}
        />
    </div>
  );
};

export default ChatArea;