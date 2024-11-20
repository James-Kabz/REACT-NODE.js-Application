import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  draggable: true,
  pauseOnHover: true,
};

export const showToast = {
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
