import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../component/header.jsx';
import IncomingCallPopup from '../component/call/IncomingCallPopup.jsx';
import socket from '../socket/socket.js';
import "../styles/App.css"

// Hàm kiểm tra JWT có hết hạn không
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode JWT (lấy phần payload)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    // Kiểm tra thời gian hết hạn (exp là timestamp tính bằng giây)
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    }
    
    return false;
  } catch (e) {
    console.error("Error decoding token:", e);
    return true; // Nếu lỗi thì coi như hết hạn
  }
};

// Hàm đăng xuất
export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("avatar");
  if (navigate) {
    navigate("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
};

// Interceptor cho fetch API để xử lý 401
const setupAuthInterceptor = () => {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    
    if (response.status === 401) {
      // JWT hết hạn hoặc không hợp lệ
      logout();
    }
    
    return response;
  };
};

const App = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Thiết lập auth interceptor
    setupAuthInterceptor();
    
    // Kiểm tra JWT có hết hạn không
    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      logout(navigate);
      return;
    }
   
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("register", userId);
      console.log("Socket registered with userId:", userId);
    }
  }, [navigate]);

  return (
    <div className="layout">
      <Header />
      <IncomingCallPopup />
      <Outlet />
    </div>
  );
};

export default App;
