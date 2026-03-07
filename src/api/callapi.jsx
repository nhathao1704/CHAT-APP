const BASE_URL = "https://chat-app-xot2.onrender.com";

const getToken = () => localStorage.getItem("token");


// Start Call
export const startCall = async (data) => {
  const res = await fetch(`${BASE_URL}/call/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result;
};


// Accept Call
export const acceptCall = async (callId) => {
  const res = await fetch(`${BASE_URL}/call/accept/${callId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result;
};


// Reject Call
export const rejectCall = async (callId) => {
  const res = await fetch(`${BASE_URL}/call/reject/${callId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result;
};


// End Call
export const endCall = async (callId) => {
  const res = await fetch(`${BASE_URL}/call/end/${callId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result;
};


// Missed Call
export const markMissedCall = async (callId) => {
  const res = await fetch(`${BASE_URL}/call/missed/${callId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result;
};


// Call History
export const getCallHistory = async (conversationId) => {
  const res = await fetch(
    `${BASE_URL}/call/history/${conversationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result;
};