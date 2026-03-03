import { useState, useEffect } from "react";
import { searchUsers } from "../../api/userapi";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (keyword.trim()) {
        handleSearch();
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const data = await searchUsers(keyword);
      setUsers(data);
    } catch (error) {
      console.log(error.message);

      // Nếu token hết hạn
      if (error.message === "Token expired") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-box" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search users..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {loading && <p>Searching...</p>}

      {(users.length > 0 || (keyword && !loading)) && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            zIndex: 100,
            color: "black",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => {
                  console.log("Selected:", user);
                  setKeyword("");
                  setUsers([]);
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  width="35"
                  height="35"
                  style={{ borderRadius: "50%" }}
                />
                <span>{user.username}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: "10px", textAlign: "center", color: "#999" }}>
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;