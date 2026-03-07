import { useState, useEffect } from "react";
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../api/friend";

export default function FriendRequests({ onAction }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // lấy danh sách lời mời
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getFriendRequests();
        setRequests(data || []);
      } catch (err) {
        console.error(err);
        setError("Không tải được lời mời");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // cập nhật notification trên header
  useEffect(() => {
    const evt = new CustomEvent("notificationsUpdated", {
      detail: requests.length,
    });

    window.dispatchEvent(evt);
  }, [requests]);

  // chấp nhận kết bạn
  const handleAccept = async (e, id) => {
    e.preventDefault();

    try {
      await acceptFriendRequest(id);

      // xóa request khỏi UI
      setRequests((prev) => prev.filter((r) => r._id !== id));

      // update friend list
      window.dispatchEvent(new Event("friendsUpdated"));

      if (onAction) onAction();
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  // từ chối kết bạn
  const handleReject = async (e, id) => {
    e.preventDefault();

    try {
      await rejectFriendRequest(id);

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading) return <p>Đang tải lời mời...</p>;

  if (error) return <p className="error">{error}</p>;

  if (requests.length === 0) return <p>Không có lời mời kết bạn</p>;

  return (
    <div className="friend-requests">
      <h2>Lời mời kết bạn</h2>

      {requests.map((r) => (
        <div
          key={r._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <img
            src={r?.from?.avatar || "https://i.pravatar.cc/30"}
            alt={r?.from?.username}
            width="30"
            height="30"
            style={{ borderRadius: "50%" }}
          />

          <span>{r?.from?.username}</span>

          <button
            type="button"
            onClick={(e) => handleAccept(e, r._id)}
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Chấp nhận
          </button>

          <button
            type="button"
            onClick={(e) => handleReject(e, r._id)}
            style={{
              background: "#f44336",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Từ chối
          </button>
        </div>
      ))}
    </div>
  );
}