import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTable,
  faPeopleArrows,
  faClipboard,
  faPowerOff,
  faBars,
  faMehRollingEyes,
} from "@fortawesome/free-solid-svg-icons";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`lg:w-60 bg-blue-950 text-white min-h-screen fixed z-50 top-0 transition-transform duration-300 ${
        isOpen ? "w-full lg:w-56" : "w-0"
      }`}
    >
      <div className="p-6 space-y-12 ">
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
            isOpen ? "" : "hidden"
          } lg:block`}
        >
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/sales"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faTable} />
            <span>Sales</span>
          </Link>
          <Link
            to="/customers"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faPeopleArrows} />
            <span>Sell</span>
          </Link>
          <Link
            to="/reportForm"
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
            <span>Data</span>
          </Link>
          <Link
            to="/permissions"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faPeopleArrows} />
            <span>Permissions</span>
          </Link>
          <Link
            to="/roles"
            className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faMehRollingEyes} />
            <span>Roles</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
