const BASE_URL = "http://localhost:3000/api";

export const sendFriendRequest = async (to) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/friend/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to }),
  });

  const data = await res.json();
  return data;
};

export const acceptFriendRequest = async (requestId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/friend/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });

  return await res.json();
};
export const rejectFriendRequest = async (requestId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/friend/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });

  return await res.json();
};
export const getFriends = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/friend`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch friends");
  }
  return data; // should be an array
};

export const getFriendRequests = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/friend/requests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch friend requests");
  }
  return data; // array of requests
};