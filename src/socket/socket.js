import { io } from "socket.io-client";

const socket = io("https://chat-app-xot2.onrender.com");

export default socket;