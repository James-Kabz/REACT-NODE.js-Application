import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart } from "react-icons/fa";

const ECommerceShop = () => {
  const [records, setItemsData] = useState([]);
  const { userRole } = useAuth();
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [gameDetails, setGameDetails] = useState({});
  const [newItemData, setNewItemData] = useState({
    item_name: "",
    price: "",
    image: "",
    quantity_in_stock: "",
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // RAWG search results
  const [showGameSearchModal, setShowGameSearchModal] = useState(false); // Game Search Modal visibility

  const RAWG_API_KEY = "48c8f1dcb24a41298c867ab063f3f85f"; // Replace with your RAWG API key

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/item/getAllItems")
      .then((response) => setItemsData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch games from RAWG API
  const handleGameSearch = async () => {
    try {
      const response = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: "48c8f1dcb24a41298c867ab063f3f85f",
          search: searchTerm,
        },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  // Save a selected RAWG game to the backend
  const handleSaveGame = async (game) => {
    const gameId = game.id;
    const { price, quantity_in_stock } = gameDetails[gameId] || {};

    // Ensure that price and quantity are set
    if (!price || !quantity_in_stock) {
      toast.error("Please enter price and quantity.");
      return;
    }

    const gameData = {
      item_name: game.name,
      price: parseFloat(price),
      image: game.background_image,
      quantity_in_stock: parseInt(quantity_in_stock, 10),
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/item/addItem",
        gameData
      );
      setItemsData((prevItems) => [...prevItems, response.data]);
      toast.success(`${game.name} saved successfully!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      setShowGameSearchModal(false);
    } catch (error) {
      console.error("Error saving game:", error);
      toast.error("Error saving game.");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/item/addItem", newItemData);
      axios
        .get("http://localhost:4000/api/item/getAllItems")
        .then((response) => setItemsData(response.data))
        .catch((error) => console.error("Error fetching data:", error));
      setShowAddItemModal(false);
      toast.success("Item added successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      setNewItemData({
        item_name: "",
        price: "",
        image: "",
        quantity_in_stock: "",
      });
    } catch (error) {
      toast.error("Error adding item.");
    }
  };

  const handleInputChange = (e, gameId) => {
    const { name, value } = e.target;
    setGameDetails((prevDetails) => ({
      ...prevDetails,
      [gameId]: {
        ...prevDetails[gameId],
        [name]: value,
      },
    }));
  };

  const handleNewItemDataChange = (e) => {
    const { name, value } = e.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    toast.success("Item added to cart", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.info("Item removed from cart", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
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
          });
        } else {
          toast.error("Sale failed", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.error("Error making sale for item:", item, error);
        toast.error("Sale failed", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
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
    <div className="rounded-sm p-2 mt-0 lg:mt-0">
      <div className="container font-serif">
        <h1 className="text-3xl font-bold mb-6 mt-5 lg:mt-4 text-center">
          Dashboard
        </h1>

        {/* Game Search Button */}
        <div className="flex justify-between items-center mb-4">
          {(userRole === "super-admin" || userRole === "admin") && (
            <button
              onClick={() => setShowGameSearchModal(true)}
              className="bg-purple-500 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition duration-200"
            >
              Search and Add Game
            </button>
          )}
        </div>

        {/* Game Search Modal */}
        {showGameSearchModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full md:max-w-3xl lg:max-w-4xl shadow-lg mx-4 overflow-y-auto max-h-screen">
              <h2 className="text-2xl font-bold mb-4">Search for Games</h2>

              <input
                type="text"
                placeholder="Search for a game"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md p-2 w-full mb-4"
              />

              <button
                onClick={handleGameSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-700 transition duration-200 mb-4"
              >
                Search
              </button>

              {/* Scrollable content container for search results */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 overflow-y-auto p-4"
                style={{ maxHeight: "70vh", maxWidth: "100vw" }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="rounded-lg overflow-hidden shadow-md bg-gray-100 p-4 flex flex-col"
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {game.name}
                      </h3>
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-32 md:h-48 object-cover rounded-md"
                      />

                      {/* Input for price */}
                      <label className="mt-2 font-medium">Price (KES):</label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={gameDetails[game.id]?.price || ""}
                        onChange={(e) => handleInputChange(e, game.id)}
                        className="border rounded-md p-1 mt-1 w-full"
                      />

                      {/* Input for quantity */}
                      <label className="mt-2 font-medium">Quantity:</label>
                      <input
                        type="number"
                        name="quantity_in_stock"
                        min="1"
                        value={gameDetails[game.id]?.quantity_in_stock || ""}
                        onChange={(e) => handleInputChange(e, game.id)}
                        className="border rounded-md p-1 mt-1 w-full"
                      />

                      <button
                        onClick={() => handleSaveGame(game)}
                        className="bg-green-500 text-white font-bold py-1 px-3 rounded mt-3 hover:bg-green-700 transition duration-200"
                      >
                        Save to Database
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center col-span-full">
                    No games found. Try a different search term.
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowGameSearchModal(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition duration-200 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-3">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-5">
          {records.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden shadow-md bg-gray-100 p-6"
            >
              <h2 className="text-4xl font-semibold mb-3">{item.item_name}</h2>
              <p className="text-2xl font-extrabold mb-3">
                Price: KES {item.price}
              </p>
              <img
                src={item.image}
                alt={item.item_name}
                className="w-full rounded-xl h-auto mb-3"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg" style={{ width: "600px" }}>
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            {cart.length > 0 ? (
              <ul>
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between mb-2">
                    <span>
                      {item.item_name} (KES {item.price}) x
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
                      className="text-red-600"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items in cart.</p>
            )}
            <div className="flex justify-between mt-4">
              <span className="font-bold text-lg">
                Total Price: KES {totalPrice}
              </span>
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
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
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
