import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faShoppingCart,
  faHeart,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./CartContext"; // Use Cart Context for cart state
import { FaWindowClose } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const Navigation = () => {
  const { logout, userRole, isLoggedIn } = useAuth();
  const history = useHistory();
  const { cart, setCart,handleQuantityChange, handleRemoveFromCart, totalPrice } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [loading ,setLoading] = useState(false);

  useEffect(() => {
    // Sync cart with localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      sessionStorage.clear();
      history.push("/Shop");
    }
  };

  const handleMakeSale = async () => {
    for (const item of cart) {
      try {
        setLoading(true);
        const saleData = {
          item_id: item.id,
          quantity_sold: item.quantity,
          total_price: item.price * item.quantity,
          sale_date: new Date(),
        };
        const response = await axios.post(
          "http://localhost:4000/api/sale/makeSale",
          saleData
        );

        if (response.status === 200) {
          toast.success("Sale successful", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            draggable: true,
            newestOnTop: true,
          });
        } else {
          toast.error("Sale failed", {
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
        console.error("Error making sale for item:", item, error);
        toast.error("Sale failed", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          newestOnTop: true,
        });
      } finally {
        setLoading(false);
      }
    }

    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-black text-white w-full fixed top-0 z-50">
      {/* Top Icon Bar */}
      <div className="flex justify-between items-center p-2 px-4 bg-black text-sm">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faFacebook} className="mx-2 text-blue-600" />
          <FontAwesomeIcon icon={faInstagram} className="mx-2 text-pink-500" />
          <FontAwesomeIcon icon={faWhatsapp} className="mx-2 text-green-500" />
          <FontAwesomeIcon
            icon={faTiktok}
            className="mx-2 text-black bg-white rounded-full"
          />
        </div>
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon icon={faHeart} />
          <button onClick={() => setShowCart(true)}>
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className="ml-2 bg-red-600 text-white rounded-full w-6 h-6 text-center leading-6 text-sm">
              {cart.length}
            </span>
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:bg-red-600 py-2 px-4 rounded"
            >
              Log Out
            </button>
          ) : (
            <Link to="/Login" className="hover:bg-blue-800 py-2 px-4 rounded">
              <FontAwesomeIcon icon={faSignIn} /> Login
            </Link>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex justify-between items-center p-4 bg-blue-800">
        <div className="text-3xl font-bold">WeStore</div>
        <div className="flex items-center bg-white rounded-full p-2 mx-4">
          <FontAwesomeIcon icon={faSearch} className="text-gray-500 mx-2" />
          <input
            type="text"
            placeholder="Search products"
            className="outline-none"
          />
        </div>
        <nav className="hidden lg:flex space-x-8 font-semibold text-white">
          <Link to="/Shop">Home</Link>
          <Link to="#">Gaming</Link>
          <Link to="#">TVs</Link>
          <Link to="#">Audio</Link>
          <Link to="#">Phones</Link>
          {(userRole === "admin" || userRole === "super-admin") && (
            <>
              <Link to="/AnalyticsPage">Analysis & Stock</Link>
              <Link to="/Data">Sales Data</Link>
              <Link to="/Permissions">Manage Permissions</Link>
              <Link to="/Roles">Manage Roles & Users</Link>
            </>
          )}
        </nav>
        <button onClick={toggleSidebar} className="lg:hidden text-white">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden bg-blue-800 text-white p-4 space-y-4">
          <Link to="/Shop" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="#" onClick={() => setIsOpen(false)}>
            Gaming
          </Link>
          <Link to="#" onClick={() => setIsOpen(false)}>
            TVs
          </Link>
          <Link to="#" onClick={() => setIsOpen(false)}>
            Audio
          </Link>
          <Link to="#" onClick={() => setIsOpen(false)}>
            Phones
          </Link>
          {(userRole === "admin" || userRole === "super-admin") && (
            <>
              <Link to="/AnalyticsPage" onClick={() => setIsOpen(false)}>
                Analysis & Stock
              </Link>
              <Link to="/Data" onClick={() => setIsOpen(false)}>
                Sales Data
              </Link>
              <Link to="/Permissions" onClick={() => setIsOpen(false)}>
                Manage Permissions
              </Link>
              <Link to="/Roles" onClick={() => setIsOpen(false)}>
                Manage Roles & Users
              </Link>
            </>
          )}
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 text-black">
            <button
              onClick={() => setShowCart(false)}
              className="font-bold py-2 px-4 text-2xl rounded"
            >
              <FaWindowClose />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Shopping Cart
            </h2>
            {cart.length > 0 ? (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.item_name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <span>
                      {item.item_name} (KES {item.price}) x{" "}
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                        className="w-16 ml-2 p-1 border rounded"
                      />
                    </span>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No items in cart.</p>
            )}
            <div className="flex justify-between mt-4 text-lg font-semibold">
              <span>Total Price: KES {totalPrice}</span>
              <button
                onClick={handleMakeSale}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Make Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
