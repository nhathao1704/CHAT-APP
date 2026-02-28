import SearchBar from "./searchbar";
import ChatItem from "./chatitem";

const Sidebar = () => {
  return (
    <div className="sidebar">
     
      <SearchBar />
      <ChatItem name="Chloe Adams" />
      <ChatItem name="Amin Rokhead" />
      <ChatItem name="Zaroena" />
    </div>
  );
};

export default Sidebar;