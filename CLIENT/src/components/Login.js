import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const LoginForm = () => {
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const { login, refreshToken } = useContext(AuthContext);
  const [data, setLoginData] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions

    try {
      if (!data.email || !data.email.includes("@")) {
        toast.error("Enter a valid email", { autoClose: 3000 });
        return;
      }
      if (data.password.length < 8) {
        toast.error("Password must be at least 8 characters", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          newestOnTop: true,
        });
        return;
      }

      setLoading(true); // Start loading

      const response = await axios.post(
        "http://localhost:4000/api/user/loginUser",
        data
      );

      if (response.status === 200) {
        const {
          accessToken,
          refreshToken: newRefreshToken,
          roleId,
        } = response.data;

        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", newRefreshToken);
        sessionStorage.setItem("userRole", roleId);

        login(roleId);
        history.replace("/dashboard");

        toast.success("Login Successful. Welcome", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          newestOnTop: true,
        });
      } else if (response.status === 401) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          await handleLogin(e);
        } else {
          toast.error("Invalid username/password", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            draggable: true,
            newestOnTop: true,
          });
        }
      } else {
        toast.error("Authentication Failed", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          newestOnTop: true,
        });
      }
    } catch (error) {
      toast.error("Invalid username/password", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    } finally {
      setLoading(false); // Stop loading after all processes are completed
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl text-center font-bold mb-6 text-blue-700">
          Admin Login
        </h1>
        <h2 className="text-lg text-center mb-6 text-gray-600">
          Sign in to Game Box
        </h2>

        {/* Email Field */}
        <label className="block mb-2 text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your Email"
          name="email"
          value={data.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 mb-5"
        />

        {/* Password Field */}
        <label className="block mb-2 text-gray-700 font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter your Password"
          name="password"
          value={data.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 mb-6"
        />

        {/* Login Button with Conditional Loader */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-200 mb-4 flex items-center justify-center"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <FaSpinner className="animate-spin mr-2" /> // Loading spinner icon
          ) : (
            "Login"
          )}
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default LoginForm;
