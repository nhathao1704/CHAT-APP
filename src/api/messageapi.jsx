const BASE_URL = "https://chat-app-xot2.onrender.com/api";

/**
 * Lấy toàn bộ tin nhắn theo conversationId
 */
export const getMessages = async (conversationId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/message/${conversationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch messages");
  }

  return data;
};