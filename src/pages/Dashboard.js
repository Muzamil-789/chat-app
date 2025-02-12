import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import Sidebar from "../components/Sidebar";
import Header from "../components/header";
import { push, ref, set, onValue, remove } from "firebase/database";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;
    const currentUser = auth.currentUser.displayName;
    const usersPath = [currentUser, selectedUser].sort().join("-");
    const messagesRef = ref(db, `messages/${usersPath}`);

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });
  }, [selectedUser]);

  const sendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const currentUser = auth.currentUser.displayName;
    const usersPath = [currentUser, selectedUser].sort().join("-");

    if (editMessageId) {
      const messageRef = ref(db, `messages/${usersPath}/${editMessageId}`);
      set(messageRef, {
        message: trimmedMessage,
        sender: currentUser,
        timestamp: new Date().toISOString(),
      }).then(() => {
        setNewMessage("");
        setEditMessageId(null);
      });
    } else {
      const messagesRef = ref(db, `messages/${usersPath}`);
      const newMessageRef = push(messagesRef);

      set(newMessageRef, {
        message: trimmedMessage,
        sender: currentUser,
        timestamp: new Date().toISOString(),
      }).then(() => setNewMessage(""));
    }
  };

  const deleteMessage = (msgId) => {
    const currentUser = auth.currentUser.displayName;
    const usersPath = [currentUser, selectedUser].sort().join("-");
    const messageRef = ref(db, `messages/${usersPath}/${msgId}`);
    remove(messageRef);
  };
  const updateMessage = (msgId, message) => {
    setNewMessage(message);
    setEditMessageId(msgId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: "#f1f3f5" }}>
      <Sidebar setSelectedUser={setSelectedUser} />
      <div className="flex-grow-1 d-flex flex-column">
        <Header setSelectedUser={setSelectedUser} selectedUser={selectedUser} />

        {selectedUser ? (
          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {messages.map((msg) => {
              const formattedTime = new Date(msg.timestamp).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );
              return (
                <div
                  key={msg.id}
                  className={`position-relative ${
                    msg.sender === auth.currentUser.displayName
                      ? "send-message"
                      : "receive-message"
                  }`}
                  onClick={() => setSelectedMessage(msg.id)}
                  style={{ cursor: "pointer" }}
                >
                  <span>{msg.message}</span>
                  <div
                    style={{
                      fontSize: "0.8em",
                      marginTop: "5px",
                      opacity: "0.7",
                    }}
                  >
                    {formattedTime}
                  </div>
                  {selectedMessage === msg.id &&
                    msg.sender === auth.currentUser.displayName && (
                      <div
                        className="dropdown-menu show position-absolute"
                        ref={dropdownRef}
                      >
                        <button
                          className="dropdown-item"
                          onClick={() => deleteMessage(msg.id)}
                        >
                          Delete
                        </button>

                        <button
                          className="dropdown-item"
                          onClick={() => updateMessage(msg.id, msg.message)}
                        >
                          Update
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="d-flex flex-column align-items-center justify-content-center h-100"
            style={{
              background: "linear-gradient(135deg, #f0f2f5, #d9e2ec)",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <h2
              className="fw-bold"
              style={{ animation: "fadeIn 1s ease-in-out", color: "#17a2b8" }}
            >
              Welcome, {auth.currentUser?.displayName}! 👋
            </h2>

            <p className="text-muted" style={{ fontSize: "1.1rem" }}>
              Select a user to start chatting
            </p>

            <i
              className="bi bi-chat-dots-fill text-primary"
              style={{ fontSize: "4rem", margin: "15px 0" }}
            ></i>
            <style>
              {`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-100px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>
          </div>
        )}

        {selectedUser && (
          <div className="p-3 border-top bg-white d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ borderRadius: "50px", paddingLeft: "20px" }}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              style={{ borderRadius: "50px", padding: "10px 20px" }}
            >
              {editMessageId ? "Update" : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
