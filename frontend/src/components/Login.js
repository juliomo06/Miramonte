import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const LoginRegisterModal = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => setIsRegister(!isRegister);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        { email, password }
      );
      const { token, role, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      onClose();
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "moderator") {
        navigate("/moderator");
      } else {
        localStorage.setItem("reloadAfterLogin", "true");
        window.location.reload();
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      Swal.fire("Login failed", "Please check your credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users/register", {
        name,
        email,
        password,
        role: "user",
      });

      Swal.fire("Success", "Please check your email for the verification code.", "success");
      setIsVerification(true);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/users/verify", {
        email,
        verificationCode,
      });
      Swal.fire("Verified", "Your email has been verified. You can now log in.", "success");
      setIsVerification(false);
      setIsRegister(false);
    } catch (err) {
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold ">
            {isVerification
              ? "Email Verification"
              : isRegister
              ? "Register"
              : "Login"}
          </h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {isVerification ? (
          <form onSubmit={handleVerificationSubmit} className="w-full flex flex-col mt-8">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <label className="input input-bordered flex items-center gap-2">
              <input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                type="text"
                className="grow"
                placeholder="Verification Code"
              />
            </label>

            <div className="flex flex-col justify-between mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded "
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        ) : (
          <div className="relative w-full overflow-hidden h-72">
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out transform ${
                isRegister ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              <form
                onSubmit={handleLoginSubmit}
                className="w-full flex flex-col mt-8"
              >
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="grow"
                    placeholder="Email"
                  />
                </label>
                <label className="input input-bordered flex my-2 items-center mt-4 gap-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="grow "
                    placeholder="********"
                  />
                </label>

                <div className="flex flex-col justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded "
                    disabled={loading}
                    aria-disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>

            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out transform ${
                isRegister ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <form
                onSubmit={handleRegisterSubmit}
                className="w-full mt-2 space-y-3"
              >
                {error && <p className="text-red-500 ">{error}</p>}
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="grow"
                    placeholder="Name"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="Email"
                    className="grow"
                    placeholder="Email"
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="grow"
                    placeholder="Type Password"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    className="grow"
                    placeholder="Confirm Password"
                  />
                </label>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!isVerification && (
          <button
            onClick={toggleForm}
            className="flex items-center justify-center mt-2 underline"
          >
            {isRegister ? "Already have an account?" : "New User? Sign Up"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginRegisterModal;
