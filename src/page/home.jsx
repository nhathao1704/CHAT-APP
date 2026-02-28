import Sidebar from "../component/sidebar/sidebar";
import Chatarea from "../component/chat/chatarea";
import "../styles/home.css";

const Home = () => {
    return (
       <div className="app">
        <Sidebar />
        <Chatarea />
    </div>
    );
}

export default Home;