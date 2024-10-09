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
            <nav className="navbar bg-blue-950 flex flex-col lg:flex-row w-full items-center ml-0 p-7 top-0 z-20 fixed">
                {/* Left section */}
                <div className="mr-0 lg:mr-5">
                    <h1 className="text-2xl lg:text-3xl text-white">Welcome</h1>
                </div>
                <div className="form">
                    <form className="flex items-center" onSubmit={handleSearch}>
                        <input 
                            type="date" 
                            placeholder="Search by Date" 
                            className="bg-gray-100 border border-gray-100 rounded-md py-2 ml-0 lg:ml-60 px-0 lg:px-80  text-dark-900focus:outline-none focus:ring focus:border-blue-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="ml-2 bg-lime-700 text-white rounded-xl p-2">Search</button>
                    </form>
                </div>

                <div className="ml-0 lg:ml-64">
                    <button className="bg-lime-700 text-white rounded-xl p-2 ml-3" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>            

            </nav>
        </div>
    );
};

export default Navbar;
