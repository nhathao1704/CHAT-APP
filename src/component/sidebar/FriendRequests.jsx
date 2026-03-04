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

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getFriendRequests();
        setRequests(data || []);
      } catch (err) {
        setError("Không tải được lời mời");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // inform other components (header) when count changes
  useEffect(() => {
    const evt = new CustomEvent('notificationsUpdated', { detail: requests.length });
    window.dispatchEvent(evt);
  }, [requests]);

  const handleAccept = async (id) => {
    try {
      await acceptFriendRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      onAction && onAction();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectFriendRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Đang tải lời mời...</p>;
  if (error) return <p className="error">{error}</p>;
  if (requests.length === 0) return null;

  return (
    <div className="friend-requests">
      <h2>Lời mời kết bạn</h2>
      {requests.map((r) => (
        <div
          key={r._id}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <img
            src={r.from.avatar || "https://i.pravatar.cc/30"}
            alt={r.from.username}
            width="30"
            height="30"
            style={{ borderRadius: "50%" }}
          />
          <span>{r.from.username}</span>
          <button onClick={() => handleAccept(r._id)}>Chấp nhận</button>
          <button onClick={() => handleReject(r._id)}>Từ chối</button>
        </div>
      ))}
    </div>
  );
}
