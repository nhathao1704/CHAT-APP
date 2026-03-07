import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket/socket";
import { FaPhone, FaPhoneSlash } from "react-icons/fa";
import "../../styles/callpopup.css";

import ringtone from "../../sounds/ringtone.mp3";

const IncomingCallPopup = () => {

  const [incomingCall, setIncomingCall] = useState(null);

  const navigate = useNavigate();

  const ringtoneRef = useRef(null);
  const incomingCallRef = useRef(null);

  // ===============================
  // INIT SOCKET LISTENERS
  // ===============================

  useEffect(() => {

    ringtoneRef.current = new Audio(ringtone);
    ringtoneRef.current.loop = true;

    // ===============================
    // INCOMING CALL
    // ===============================

    const handleIncomingCall = (data) => {

      console.log("Incoming call:", data);

      const callData = {
        callId: data.callId,
        callerId: data.callerId,
        offer: data.offer,
        callerInfo: data.callerInfo,
        conversationId: data.conversationId,
        type: data.type
      };

      setIncomingCall(callData);
      incomingCallRef.current = callData;

      ringtoneRef.current
        ?.play()
        .catch(() => {});

    };

    // ===============================
    // CALL ENDED
    // ===============================

    const handleCallEnded = (data) => {

      console.log("CALL ENDED RECEIVED:", data);

      if (!incomingCallRef.current) return;

      if (data.callId === incomingCallRef.current.callId) {

        stopRingtone();

        setIncomingCall(null);
        incomingCallRef.current = null;

      }

    };

    // ===============================
    // CALL REJECTED
    // ===============================

    const handleCallRejected = () => {

      stopRingtone();

      setIncomingCall(null);
      incomingCallRef.current = null;

    };

    // SOCKET EVENTS

    socket.on("incoming-call", handleIncomingCall);

    socket.on("callEnded", handleCallEnded);

    socket.on("callRejected", handleCallRejected);

    return () => {

      socket.off("incoming-call", handleIncomingCall);

      socket.off("callEnded", handleCallEnded);

      socket.off("callRejected", handleCallRejected);

    };

  }, []);

  // ===============================
  // STOP RINGTONE
  // ===============================

  const stopRingtone = () => {

    if (ringtoneRef.current) {

      ringtoneRef.current.pause();

      ringtoneRef.current.currentTime = 0;

    }

  };

  // ===============================
  // ACCEPT CALL
  // ===============================

  const handleAccept = () => {

    if (!incomingCall) return;

    stopRingtone();

    const friend = {
      _id: incomingCall.callerId,
      username: incomingCall.callerInfo?.username,
      avatar: incomingCall.callerInfo?.avatar,
      conversationId: incomingCall.conversationId
    };

    navigate("/callpage", {
      state: {
        isIncoming: true,
        friend,
        callerId: incomingCall.callerId,
        callId: incomingCall.callId,
        offer: incomingCall.offer,
        callerInfo: incomingCall.callerInfo,
        conversationId: incomingCall.conversationId
      }
    });

    setIncomingCall(null);
    incomingCallRef.current = null;

  };

  // ===============================
  // REJECT CALL
  // ===============================

  const handleReject = () => {

    if (!incomingCall) return;

    stopRingtone();

    socket.emit("rejectCall", {
      callId: incomingCall.callId
    });

    setIncomingCall(null);
    incomingCallRef.current = null;

  };

  // ===============================
  // NO CALL → NO POPUP
  // ===============================

  if (!incomingCall) return null;

  // ===============================
  // UI
  // ===============================

  return (
    <div className="incoming-call-overlay">

      <div className="incoming-call-popup">

        <div className="caller-avatar">

          <img
            src={
              incomingCall.callerInfo?.avatar ||
              "https://i.pravatar.cc/100"
            }
            alt="caller avatar"
          />

        </div>

        <div className="call-info">

          <h3>
            {incomingCall.callerInfo?.username} đang gọi cho bạn
          </h3>

          <p className="call-status-text">
            Cuộc gọi thoại đến...
          </p>

        </div>

        <div className="call-actions">

          <button
            className="reject-btn"
            onClick={handleReject}
          >
            <FaPhoneSlash />
          </button>

          <button
            className="accept-btn"
            onClick={handleAccept}
          >
            <FaPhone />
          </button>

        </div>

      </div>

    </div>
  );

};

export default IncomingCallPopup;