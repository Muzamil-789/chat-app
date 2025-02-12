import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthRouting = () => {
  const [isUser, setIsUser] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsUser(user.uid);
    } else {
    }
  });

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={isUser ? <Dashboard /> : <Login />} />
      </Routes>
    </div>
  );
};

export default AuthRouting;
