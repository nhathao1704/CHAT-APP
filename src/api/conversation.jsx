const BASE_URL = "https://chat-app-xot2.onrender.com/api";

export const createConversation = async (receiverId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ receiverId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to create conversation");
  }
  return data;
};

export const getConversations = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/conversation`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch conversations");
  }
  return data;
};

export const getConversationById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/conversation/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch conversation");
  }
  return data;
};

