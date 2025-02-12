import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error);
      });
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
            width: "350px",
            borderRadius: "15px",
            backgroundColor: "#343a40",
            color: "#f8f9fa",
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ fontWeight: "bold", color: "#17a2b8" }}
          >
            Chat App Login
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
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
            <div className="mb-3">
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
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <a href="/signup" style={{ color: "#17a2b8", fontWeight: "bold" }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
