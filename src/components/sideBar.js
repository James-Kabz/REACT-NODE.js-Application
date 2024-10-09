import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTable, faPeopleArrows, faClipboard, faPowerOff, faBars } from '@fortawesome/free-solid-svg-icons';
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`lg:w-60 bg-blue-950 min-h-screen fixed z-50 top-0 transition-all duration-300 ${isOpen ? 'w-full lg:w-56' : 'w-0'}`}>
            <div className="text-white p-5 space-y-10">
                <h1 className=" text-xl lg:text-4xl font-semibold mb-20 ">Game Box</h1>

                <div className="flex justify-center lg:hidden">
                    <button onClick={toggleSidebar} className="focus:outline-none">
                        {isOpen ? (
                            <FontAwesomeIcon icon={faPowerOff} size="lg" />
                        ) : (
                            <FontAwesomeIcon icon={faBars} size="lg mb-4" />
                        )}
                    </button>
                </div>

                <ul className={`space-y-20 font-bold text-sm lg:text-2xl ${isOpen ? '' : 'hidden'} lg:block`}>
                    <li><Link to="/dashboard" className="block py-2 px-4"><FontAwesomeIcon icon={faHome} /> Dashboard </Link></li>
                    <li><Link to="/sales" className="block py-2 px-4"><FontAwesomeIcon icon={faTable} /> Sales</Link></li>
                    <li><Link to="/customers" className="block py-2 px-4"><FontAwesomeIcon icon={faPeopleArrows} /> Sell</Link></li>
                    <li><Link to="/reportForm" className="block py-2 px-4"><FontAwesomeIcon icon={faClipboard} /> Reports</Link></li>
                    <li><Link to="/Data" className="block py-2 px-4"><FontAwesomeIcon icon={faClipboard} /> Data</Link></li>
                   
                </ul>
                
            </div>
        </div>
    );
};

export default Sidebar;
