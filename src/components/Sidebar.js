import React, { useEffect, useState } from "react";

import "../assets/css/Sidebar.css";
import { auth, db } from "../firebase";
import { onValue, ref } from "firebase/database";

const Sidebar = ({ setSelectedUser }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [users, setUsers] = useState([]);
  const [searchuser, setSearchUser] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user.displayName);
    }
  }, []);

  // useEffect(() => {
  //   const usersRef = ref(db, "users");

  //   onValue(usersRef, (snapshot) => {
  //     const usersData = snapshot.val();
  //     if (usersData) {
  //       const usersList = Object.keys(usersData)
  //         .map((userId) => ({
  //           id: userId,
  //           displayName: usersData[userId].displayName,
  //         }))
  //         .filter((user) => user.displayName !== currentUser);
  //       setUsers(usersList);
  //     }
  //   });
  // }, [currentUser]);

  useEffect(() => {
    const currentUser = auth.currentUser.displayName;
    const usersRef = ref(db, "users");
    const messagesRef = ref(db, "messages");

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (!usersData) return;

      onValue(messagesRef, (messagesSnapshot) => {
        const messagesData = messagesSnapshot.val();
        if (!messagesData) {
          setUsers([]);
          return;
        }

        const chatedUsers = Object.keys(messagesData)
          .filter((chatKey) => chatKey.includes(currentUser))
          .map((chatKey) =>
            chatKey.split("-").find((user) => user !== currentUser)
          )
          .filter((user) => user);

        const filteredUsers = Object.keys(usersData)
          .map((userId) => ({
            id: userId,
            displayName: usersData[userId].displayName,
          }))
          .filter((user) => chatedUsers.includes(user.displayName));

        setUsers(filteredUsers);
      });
    });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchuser.toLowerCase())
  );

  return (
    <div className="sidebar-container">
      <div className="profile-section">
        <img src="profile.jpg" alt="User" className="profile-pic" />
        <div className="profile-info">
          <span className="profile-name">{currentUser}</span>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchUser(e.target.value)}
          value={searchuser}
        />
      </div>
      <div className="chat-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              className="chat-item"
              key={user.id}
              onClick={() => setSelectedUser(user.displayName)}
            >
              <img src="user-avatar.jpg" alt="" className="chat-avatar" />
              <div className="chat-info">
                <span className="chat-name">{user.displayName}</span>
                {/* <div>
                    <span className="chat-message">Last message here...</span>
                    <span className="chat-time">10:35 AM</span>
                  </div> */}
              </div>
            </div>
          ))
        ) : (
          <p className="no-users">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
