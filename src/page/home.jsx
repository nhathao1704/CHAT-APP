import Sidebar from "../component/sidebar/sidebar";
import ChatArea from "../component/chat/chatarea";
import { useState } from "react";
import "../styles/home.css";
import { createConversation } from "../api/conversation";

const Home = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleSelect = async (friend) => {
    try {
        const conversation = await createConversation(friend._id);

        setSelectedFriend({
        ...friend,
        conversationId: conversation._id
        });

    } catch (err) {
        console.error("create conversation error", err);
    }
    };

    return (
       <div className="app">
        <Sidebar onSelect={handleSelect} selected={selectedFriend} />
        <ChatArea friend={selectedFriend} />
    </div>
    );
}

export default Home;