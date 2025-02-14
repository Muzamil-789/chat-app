import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import Sidebar from "../components/Sidebar";
import Header from "../components/header";
import { push, ref, set, onValue, remove } from "firebase/database";
import { supabase } from "../supabase";
import Attachment from "../assets/images/attachment.png";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);
  const [mediaFile, setMediaFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log(mediaFile);
  const dropdownRef = useRef(null);

  const toggleAttachmentDropdown = () => {
    setShowAttachmentDropdown(!showAttachmentDropdown);
  };

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

  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage && !mediaFile) return;

    setIsLoading(true);

    const currentUser = auth.currentUser.displayName;
    const usersPath = [currentUser, selectedUser].sort().join("-");
    const messagesRef = ref(db, `messages/${usersPath}`);
    let mediaUrl = null;

    if (mediaFile) {
      mediaUrl = await uploadInSupabase(mediaFile);
      setMediaFile("");
    }

    if (editMessageId) {
      const messageRef = ref(db, `messages/${usersPath}/${editMessageId}`);
      set(messageRef, {
        message: trimmedMessage,
        sender: currentUser,
        timestamp: new Date().toISOString(),
        media: mediaUrl || null,
      }).then(() => {
        setNewMessage("");
        setEditMessageId(null);
        setIsLoading(false);
      });
    } else {
      const newMessageRef = push(messagesRef);

      set(newMessageRef, {
        message: trimmedMessage,
        sender: currentUser,
        timestamp: new Date().toISOString(),
        media: mediaUrl || null,
      }).then(() => {
        setNewMessage("");
        setIsLoading(false);
      });
    }
  };

  const uploadInSupabase = async (file) => {
    try {
      if (!file) return null;

      const filePath = `Media/${file.name}`;

      await supabase.storage.from("chat-app-storage").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

      const { data: publicUrlData } = supabase.storage
        .from("chat-app-storage")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Upload Error:", err);
      return null;
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAttachmentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
    }
  };

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
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {msg.media &&
                      (() => {
                        const isImage = msg.media.match(
                          /\.(jpg|jpeg|png|gif)$/i
                        );
                        const isVideo = msg.media.endsWith(".mp4");
                        const isDocument = msg.media.match(
                          /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i
                        );

                        if (isVideo) {
                          return (
                            <video
                              controls
                              src={msg.media}
                              style={{ maxWidth: "150px" }}
                            />
                          );
                        } else if (isImage) {
                          return (
                            <img
                              src={msg.media}
                              alt="Sent file"
                              style={{ maxWidth: "150px" }}
                            />
                          );
                        } else if (isDocument) {
                          return (
                            <a
                              href={msg.media}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              <div className="document-container">
                                <div className="document-icon">📄</div>
                                <div className="document-info">
                                  <span className="document-name">
                                    {msg.media.split("/").pop().split("?")[0]}
                                  </span>
                                  <span className="document-text">
                                    Click to view
                                  </span>
                                </div>
                              </div>
                            </a>
                          );
                        }
                      })()}

                    {msg.message && (
                      <span
                        style={{
                          color:
                            msg.sender === auth.currentUser.displayName
                              ? "#ffffff"
                              : "3333333",
                        }}
                      >
                        {msg.message}
                      </span>
                    )}
                  </div>

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
                          Delete For Both
                        </button>

                        <button className="dropdown-item">Delete For Me</button>

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
            <div style={{ width: "90%", position: "relative" }}>
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ borderRadius: "50px", paddingLeft: "20px" }}
              />
              <span className="attachment" onClick={toggleAttachmentDropdown}>
                <img src={Attachment} alt="Attachment Icon" />
              </span>
              {showAttachmentDropdown && (
                <div className="attachment-dropdown" ref={dropdownRef}>
                  <input
                    type="file"
                    id="Imagefile"
                    accept="image/*, video/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <input
                    type="file"
                    id="documentInput"
                    accept=".pdf, .doc, .docx, .txt"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => document.getElementById("Imagefile").click()}
                  >
                    📷 Upload Media
                  </button>
                  {/* <button
                    onClick={() => document.getElementById("videoFile").click()}
                  >
                    🎥 Upload Video
                  </button> */}
                  <button
                    onClick={() =>
                      document.getElementById("documentInput").click()
                    }
                  >
                    📄 Upload Document
                  </button>
                </div>
              )}
            </div>
            <div style={{ width: "10%", textAlign: "end" }}>
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                style={{ borderRadius: "50px", padding: "10px 20px" }}
                disabled={isLoading}
              >
                {isLoading
                  ? "Sending..."
                  : editMessageId
                  ? "Update"
                  : mediaFile
                  ? "Send Media"
                  : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
