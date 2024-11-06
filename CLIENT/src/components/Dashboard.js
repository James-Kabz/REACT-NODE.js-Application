import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const ECommerceShop = () => {
  const [records, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  // const [newItemData, setNewItemData] = useState({
  //   item_name: "",
  //   price: "",
  //   image: "",
  //   quantity_in_stock: "",
  // });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);


  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(
          "http://localhost:4000/api/item/getAllItems"
        );
        setItemsData(response.data);
      } catch (error) {
        toast.error("Error fetching data:", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          newestOnTop: true,
        });
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch games from RAWG API



  // const handleNewItemDataChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewItemData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

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
    toast.success("Item added to cart", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnFocusLoss: false,
      draggable: true,
      newestOnTop: true,
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.info("Item removed from cart", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnFocusLoss: false,
      draggable: true,
      newestOnTop: true,
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
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

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="rounded-sm p-2 mt-0 lg:mt-10">
      <div className="container mx-auto font-serif px-4 lg:px-10">
        <h1 className="text-3xl font-bold mb-6 mt-5 lg:mt-4 text-center">
          Dashboard
        </h1>


        <div className="flex justify-end items-center mb-6">
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded relative"
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
              className="rounded-lg overflow-hidden shadow-md bg-gray-100 p-6 flex flex-col items-center text-center"
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-auto"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
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
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCart(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ECommerceShop;
