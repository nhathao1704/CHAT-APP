import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { FaPhoneSlash } from "react-icons/fa";
import callingSound from "../sounds/calling.mp3";

const CallPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const friend = location.state?.friend;
  const isIncoming = location.state?.isIncoming;
  const offer = location.state?.offer;
  const callerId = location.state?.callerId;
  const callId = location.state?.callId;
  const conversationId = location.state?.conversationId;

  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteAudio = useRef(null);
  const ringingAudio = useRef(null);

  const hasEndedRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(callId);

  // =============================
  // INIT CALL
  // =============================

  useEffect(() => {

    socket.on("callCreated", ({ callId }) => {
      setCurrentCallId(callId);
    });

    if (isIncoming) {
      answerCall();
    } else {
      startCall();
    }

    // call accepted
    socket.on("callAccepted", async ({ answer }) => {

      try {

        if (ringingAudio.current) {
          ringingAudio.current.pause();
          ringingAudio.current.currentTime = 0;
        }

        if (peerConnection.current && answer) {
          await peerConnection.current.setRemoteDescription(answer);
          setIsConnected(true);
        }

      } catch (err) {
        console.error(err);
      }

    });

    // ICE candidate
    socket.on("iceCandidate", async ({ candidate }) => {

      try {

        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(candidate);
        }

      } catch (err) {
        console.error(err);
      }

    });

    // CALL ENDED
    socket.on("callEnded", ({ callId: endedCallId }) => {

      if (endedCallId !== currentCallId) return;

      cleanupCall();

      if (conversationId) {
        navigate(`/home?conversation=${conversationId}`, { replace: true });
      } else {
        navigate("/home");
      }

    });

    // CALL REJECTED
    socket.on("callRejected", () => {

      cleanupCall();

      navigate("/home");

    });

    return () => {

      socket.off("callAccepted");
      socket.off("iceCandidate");
      socket.off("callEnded");
      socket.off("callRejected");
      socket.off("callCreated");

      cleanupCall();

    };

  }, []);

  // =============================
  // START CALL (Caller)
  // =============================

  const startCall = async () => {

    try {

      ringingAudio.current = new Audio(callingSound);
      ringingAudio.current.loop = true;
      ringingAudio.current.play();

      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteAudio.current) {
          remoteAudio.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {

        if (event.candidate && friend?._id) {

          socket.emit("iceCandidate", {
            candidate: event.candidate,
            to: friend._id
          });

        }

      };

      const offer = await peerConnection.current.createOffer();

      await peerConnection.current.setLocalDescription(offer);

      socket.emit("callUser", {
        conversationId: friend.conversationId,
        callerId: localStorage.getItem("userId"),
        receiverId: friend._id,
        type: "audio",
        callerInfo: {
          username: localStorage.getItem("username"),
          avatar: localStorage.getItem("avatar")
        },
        offer
      });

    } catch (err) {
      console.error("Start call error:", err);
    }

  };

  // =============================
  // ANSWER CALL
  // =============================

  const answerCall = async () => {

    try {

      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteAudio.current) {
          remoteAudio.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {

        if (event.candidate) {

          socket.emit("iceCandidate", {
            candidate: event.candidate,
            to: callerId
          });

        }

      };

      await peerConnection.current.setRemoteDescription(offer);

      const answer = await peerConnection.current.createAnswer();

      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer-call", {
        answer,
        to: callerId
      });

      socket.emit("acceptCall", {
        callId
      });

    } catch (err) {
      console.error(err);
    }

  };

  // =============================
  // CLEANUP CALL
  // =============================

  const cleanupCall = () => {

    if (hasEndedRef.current) return;

    hasEndedRef.current = true;

    setIsEnded(true);
    setIsConnected(false);

    if (ringingAudio.current) {
      ringingAudio.current.pause();
      ringingAudio.current.currentTime = 0;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }

  };

  // =============================
  // END CALL BUTTON
  // =============================

  const handleEndCall = () => {

    if (!currentCallId) return;

    socket.emit("endCall", {
      callId: currentCallId
    });

    cleanupCall();

    if (conversationId) {
      navigate(`/home?conversation=${conversationId}`, { replace: true });
    } else {
      navigate("/home");
    }

  };

  // =============================
  // STATUS TEXT
  // =============================

  const getCallStatus = () => {

    if (isEnded) return "Cuộc gọi đã kết thúc";

    if (isConnected) return "Đã kết nối";

    return isIncoming ? "Đang đổ chuông..." : "Đang gọi...";

  };

  // =============================
  // UI
  // =============================

  return (
    <div className="call-page">

      <h2>
        {isIncoming ? "In call with" : "Calling"} {friend?.username}
      </h2>

      <p className="call-status">
        {getCallStatus()}
      </p>

      <audio ref={remoteAudio} autoPlay />

      <button
        className="end-call-btn"
        onClick={handleEndCall}
      >
        <FaPhoneSlash />
      </button>

    </div>
  );

};

export default CallPage;