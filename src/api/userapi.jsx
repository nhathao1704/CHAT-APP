const base_url = "http://localhost:3000/api";

const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
    const res = await fetch(`${base_url}/user/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user profile");
    }
    return data;
};

const updateUserProfile = async (profileData) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("User is not authenticated");
    }
    const res = await fetch(`${base_url}/user/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },  
        body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update user profile");
    }
    return data;
};

const changeAvatar = async (avatarUrl) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("User is not authenticated");
    }
    const res = await fetch(`${base_url}/user/avatar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
    });
    const data = await res.json();  
    if (!res.ok) {
        throw new Error(data.message || "Failed to change avatar");
    }
    return data;
};

export { getUserProfile, updateUserProfile, changeAvatar };