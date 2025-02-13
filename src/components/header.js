// import React, { useState } from "react";
// import { signOut } from "firebase/auth";
// // import { auth } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase";

// const Header = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await signOut(auth)
//       .then(() => {
//         navigate("/login");
//       })
//       .catch((error) => {
//         console.log("Error", error);
//       });
//   };

//   return (
//     <div className="chat-header">
//       <h5>Chat Room</h5>
//       <div className="settings-dropdown">
//         <button
//           className="settings-button"
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         >
//           Settings
//         </button>
//         {isDropdownOpen && (
//           <div className="dropdown-content">
//             <button onClick={handleLogout}>Logout</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onValue, ref } from "firebase/database";

const Header = ({ setSelectedUser, selectedUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersList = Object.keys(usersData)
          .map((userId) => ({
            id: userId,
            displayName: usersData[userId].displayName,
          }))
          .filter((user) => user.displayName !== auth.currentUser.displayName);
        setUsers(usersList);
      }
    });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleLogout = async () => {
    await signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  return (
    <div className="chat-header">
      <h5>User: {selectedUser ? selectedUser : "No User Selected"}</h5>
      <div className="header-buttons">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          New Chat
        </button>
        <div className="settings-dropdown">
          <button
            className="settings-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Settings 
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
            >
              ❌
            </button>
            <h4>Search Users</h4>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />

            <div className="user-list">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    className="user-item"
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user.displayName);
                      setIsModalOpen(false);
                    }}
                  >
                    <img src="user-avatar.jpg" alt="" className="user-avatar" />
                    <span className="user-name">{user.displayName}</span>
                  </div>
                ))
              ) : (
                <p>No users found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
