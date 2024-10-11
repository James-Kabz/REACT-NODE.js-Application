import React, { useState } from "react";
import {  useHistory } from 'react-router-dom';
// import axios from 'axios';
import { useAuth } from "./AuthContext";

const Navbar = () => {
    const {  logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const history = useHistory();

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to log out');
        if (confirmLogout) {
            logout();
            sessionStorage.clear();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        history.push(`/data?sale_date=${searchQuery}`);
    };

    return (
      <div>
        <nav className="navbar bg-blue-950 flex flex-col lg:flex-row items-center justify-between p-5 lg:p-7 w-full top-0 z-20 fixed shadow-lg">
          {/* Left Section - Welcome Message */}
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl lg:text-3xl text-white font-bold">
              Welcome
            </h1>
          </div>

          {/* Search Form */}
          <div className="flex-grow">
            <form
              className="flex items-center justify-center lg:justify-start"
              onSubmit={handleSearch}
            >
              <input
                type="date"
                placeholder="Search by Date"
                className="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 w-full lg:w-96 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-300 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 bg-lime-700 text-white font-semibold rounded-md py-2 px-4 hover:bg-lime-600 transition duration-300 ease-in-out"
              >
                Search
              </button>
            </form>
          </div>

          {/* Logout Button */}
          <div className="mt-4 lg:mt-0">
            <button
              className="bg-lime-700 text-white font-semibold rounded-md py-2 px-4 hover:bg-lime-600 transition duration-300 ease-in-out"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </nav>
      </div>
    );
};

export default Navbar;
