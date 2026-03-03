import SearchBar from "./searchbar";
import ChatItem from "./chatitem";

const Sidebar = () => {
  return (
    <div className="sidebar">
     
      <SearchBar />
    <div>
      <h1>ban be </h1>
        <ChatItem name="Chloe Adams" />
        <ChatItem name="Amin Rokhead" />
        <ChatItem name="Zaroena" />
    </div>
      
    </div>
  );
};

export default Sidebar;