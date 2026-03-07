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

    const res = await fetch(`${base_url}/user/update-profile`, {
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
const chooseAvatar = async (avatarUrl) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("User is not authenticated");
    }
    const res = await fetch(`${base_url}/user/choose-avatar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to choose avatar");
    }
    return data;
};
const changePassword = async(passwordData)=>{
     const token = localStorage.getItem("token");
     if(!token){
        throw new Error("User is not authenticated" );
     }
     const res = await fetch(`${base_url}/user/change-password`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ passwordData }),
    });

            
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to choose avatar");
    }
    return data;
};

const searchUsers = async (keyword) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("Token expired");
  }

  const res = await fetch(
    `${base_url}/user/search?keyword=${encodeURIComponent(keyword)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error(data.message || "Search failed");
  }

  return data.data || data;
};
export { getUserProfile, updateUserProfile ,chooseAvatar, changePassword, searchUsers};