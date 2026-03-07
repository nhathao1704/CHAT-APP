import { useState, useEffect } from "react";
import SearchBar from "./searchbar";
import ChatItem from "./chatitem";
import FriendRequests from "./FriendRequests";
import { getFriends } from "../../api/friend";

const Sidebar = ({ onSelect, selected }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data || []);
    } catch (e) {
      setError("Không tải được danh sách bạn bè");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div className="sidebar">
      <SearchBar />
      {/* incoming requests, refresh friend list after accept */}
      <FriendRequests onAction={loadFriends} />
      <div>
        <h1>Bạn bè</h1>
        {loading && <p>Đang tải...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && friends.length === 0 && (
          <p>Chưa có bạn bè.</p>
        )}
       {!loading && !error &&
          friends
            ?.filter(Boolean)
            ?.map((f) => (
              <ChatItem
                key={f?._id}
                name={f?.name || f?.username || ""}
                avatar={f?.avatar || "https://i.pravatar.cc/40"}
                onClick={() => onSelect && onSelect(f)}
                active={selected && selected?._id === f?._id}
              />
            ))
        }
      </div>
    </div>
  );
};

export default Sidebar;