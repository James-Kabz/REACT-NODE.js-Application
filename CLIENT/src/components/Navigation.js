import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboard,
  faPowerOff,
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
import { FaShoppingCart } from "react-icons/fa";

const Navigation = () => {
  const { logout, userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/item/getAllItems"
        );
        setRecords(response.data);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    toast.success("Item added to cart");
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
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
        await axios.post("http://localhost:4000/api/sale/makeSale", saleData);
        toast.success("Sale successful");
      } catch (error) {
        toast.error("Sale failed");
      } finally {
        setLoading(false);
      }
    }
    setCart([]);
    setShowCart(false);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
          <Link to="/Login" className="hover:bg-blue-800 py-2 px-4 rounded">
            <FontAwesomeIcon icon={faSignIn} /> Login
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex justify-between items-center p-4 bg-blue-800">
        <div className="text-3xl font-bold">SCARTEK</div>
        <div className="flex items-center bg-white rounded-full p-2 mx-4">
          <FontAwesomeIcon icon={faSearch} className="text-gray-500 mx-2" />
          <input
            type="text"
            placeholder="Search products"
            className="outline-none"
          />
        </div>
        <nav className="hidden lg:flex space-x-8 font-semibold text-white">
          <Link to="#">Gaming</Link>
          <Link to="#">TVs</Link>
          <Link to="#">Audio</Link>
          <Link to="#">Phones</Link>
        </nav>
        <button onClick={toggleSidebar} className="lg:hidden text-white">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden bg-blue-800 text-white p-4 space-y-4">
          <Link to="#" className="block">
            Gaming
          </Link>
          <Link to="#" className="block">
            TVs
          </Link>
          <Link to="#" className="block">
            Audio
          </Link>
        </div>
      )}
      <div className="container mx-auto font-serif px-4 lg:px-10 overflow-auto max-h-screen">
        <h1 className="text-3xl font-bold mb-6 mt-5 lg:mt-4 text-center">
          Dashboard
        </h1>

        <div className="flex justify-end items-center mb-6">
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded relative"
            onClick={() => setShowCart(true)}
          >
            <FaShoppingCart className="mr-2" />
            View Cart
            <span className="ml-2 bg-red-600 text-white rounded-full w-6 h-6 text-center leading-6 text-sm absolute -top-2 -right-2">
              {cart.length}
            </span>
          </button>
        </div>

        {/* Items from database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {records.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden shadow-md bg-white text-black p-6 flex flex-col items-center text-center"
            >
              <h2 className="text-xl font-semibold mb-3">{item.item_name}</h2>
              <p className="text-lg font-extrabold mb-3">
                Price: KES {item.price}
              </p>
              <img
                src={item.image}
                alt={item.item_name}
                className="w-full rounded-xl mb-3"
                style={{ width: "100%", height: "250px", objectFit: "cover" }}
              />
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-auto"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">
              Shopping Cart
            </h2>
            {cart.length > 0 ? (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center text-black"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.item_name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <span>{item.item_name}</span>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="bg-gray-300 text-black px-2 py-1 rounded"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="bg-gray-300 text-black px-2 py-1 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="ml-4 text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-black">Your cart is empty.</p>
            )}
            <div className="flex justify-between items-center mt-6">
              <span className="font-bold text-xl">Total: KES {totalPrice}</span>
              <button
                onClick={handleMakeSale}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Checkout
              </button>
            </div>
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-2 right-2 text-xl text-black"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;

