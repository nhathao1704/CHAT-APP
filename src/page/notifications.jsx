import React from "react";
import FriendRequests from "../component/sidebar/FriendRequests";


const Notifications = () => {
  return (
    <div className="app">
      {/* could include sidebar or not; for simplicity just show requests */}
      <div style={{ padding: "20px" }}>
        <h1>Thông báo</h1>
        <FriendRequests />
      </div>
    </div>
  );
};

export default Notifications;
