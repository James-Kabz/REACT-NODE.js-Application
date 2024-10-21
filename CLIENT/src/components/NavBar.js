import React , {useState} from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPeopleArrows,
  faClipboard,
  faPowerOff,
  faBars,
  faMehRollingEyes,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      sessionStorage.clear();
      // Navigate to login page after logout
      history.push("/Login");
    }
  };

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };

  return (
    <div
      className={`lg:w-60 bg-blue-950 text-white min-h-screen fixed z-50 top-0 transition-transform duration-300 ${
        isOpen ? "w-full lg:w-60" : "w-0 lg:w-60"
      }`}
    >
      <div className="p-6 space-y-12">
        {/* Branding Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl lg:text-4xl font-semibold">Game Box</h1>
          <div className="lg:hidden">
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <FontAwesomeIcon icon={faPowerOff} size="lg" />
              ) : (
                <FontAwesomeIcon icon={faBars} size="lg" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          className={`space-y-10 text-sm lg:text-lg font-semibold ${
            isOpen ? "block" : "hidden lg:block"
          }`}
        >
          <Link
            to="/Dashboard"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/AnalyticsPage"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faClipboard} />
            <span>Reports</span>
          </Link>
          <Link
            to="/Data"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faClipboard} />
            <span>Sales Data</span>
          </Link>
          <Link
            to="/Permissions"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faPeopleArrows} />
            <span>Permissions</span>
          </Link>
          <Link
            to="/Roles"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faMehRollingEyes} />
            <span>Roles</span>
          </Link>

          <div className="mt-4 lg:mt-0">
            <button
              className="bg-red-600 text-white font-semibold rounded-md py-2 px-4 hover:bg-red-500 transition duration-300 ease-in-out"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
