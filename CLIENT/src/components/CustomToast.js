import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../src/CustomToast.css"; // Custom CSS for advanced styling

const defaultOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  draggable: true,
  pauseOnHover: true,
};

export const CustomToast = {
  success: (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warn: (message, options = {}) => {
    toast.warn(message, { ...defaultOptions, ...options });
  },
};

export const ToastProvider = () => (
  <ToastContainer
    position="top-center"
    autoClose={2000}
    hideProgressBar={true}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable
    pauseOnHover
  />
);
