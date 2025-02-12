import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      await set(ref(db, "users/" + user.uid), {
        displayName: username,
        email: user.email,
      });

      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#bacadb" }}
      >
        <div
          className="card p-4 shadow-lg"
          style={{
            width: "400px",
            borderRadius: "15px",
            backgroundColor: "#343a40",
            color: "#f8f9fa",
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ fontWeight: "bold", color: "#17a2b8" }}
          >
            Chat App Sign Up
          </h2>

          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#17a2b8",
                color: "#fff",
                borderRadius: "5px",
              }}
            >
              Sign Up
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account?{" "}
            <a href="/login" style={{ color: "#17a2b8", fontWeight: "bold" }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
