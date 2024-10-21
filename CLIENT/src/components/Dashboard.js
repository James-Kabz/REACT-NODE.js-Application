import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Import useAuth hook
import { ToastContainer, toast } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

const GameShop = () => {
  const [records, setGamesData] = useState([]);
  const { userRole } = useAuth();
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGameData, setNewGameData] = useState({
    game_name: "",
    price: "",
    image: "",
  }); // State to hold new game data
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }); // Cart state
  const [showCart, setShowCart] = useState(false); // State to control cart visibility

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/game/getAllGames")
      .then((response) => setGamesData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    // Persist cart state to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/game/addGame",
        newGameData
      );
      console.log("New game added:", response.data);

      // Refresh the game list
      axios
        .get("http://localhost:4000/api/game/getAllGames")
        .then((response) => setGamesData(response.data))
        .catch((error) => console.error("Error fetching data:", error));
      setShowAddGameModal(false);
      toast.success("Game added successfully!"); // Show success message
    } catch (error) {
      console.error("Error adding game:", error);
      toast.error("Error adding game."); // Show error message
    }
  };

  const handleNewGameDataChange = (e) => {
    const { name, value } = e.target;
    setNewGameData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddToCart = (game) => {
    setCart((prevCart) => {
      // Check if the game is already in the cart
      const existingGame = prevCart.find(
        (item) => item.game_id === game.game_id
      );
      if (existingGame) {
        // Update the quantity if it exists
        return prevCart.map((item) =>
          item.game_id === game.game_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add the game to the cart with a quantity of 1
      return [...prevCart, { ...game, quantity: 1 }];
    });
    toast.success(`${game.game_name} added to cart!`); // Notify user
  };

  const handleRemoveFromCart = (game_id) => {
    setCart((prevCart) => prevCart.filter((item) => item.game_id !== game_id));
    toast.info("Game removed from cart."); // Notify user
  };

  const handleQuantityChange = (game_id, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.game_id === game_id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleMakeSale = async () => {
    for (const item of cart) {
      try {
        const saleData = {
          game_id: item.game_id,
          quantity_sold: item.quantity,
          total_price: item.price * item.quantity,
          sale_date: new Date(),
        };

        const response = await axios.post(
          "http://localhost:4000/api/sale/makeSale",
          saleData
        );

        if (response.status === 200) {
          toast.success(`Sale successful for ${item.game_name}!`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        } else {
          toast.error(`Sale failed for ${item.game_name}`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error making sale for item:", item, error);
        toast.error(`Sale failed for ${item.game_name}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    }

    // Clear cart and reset form
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ); // Calculate total price

  return (
    <div className="rounded-sm p-2 mt-0 lg:mt-0">
      <div className="container font-serif">
        <h1 className="text-3xl font-bold mb-6 mt-5 lg:mt-4 text-center">
          DashBoard
        </h1>
        {(userRole === "super-admin" || userRole === "admin") && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-3 rounded"
            onClick={() => setShowAddGameModal(true)}
          >
            Add Game
          </button>
        )}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mb-3 rounded"
          onClick={() => setShowCart(true)} // Show cart
        >
          View Cart ({cart.length})
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:max-w-screen-2xl lg:max-w-full gap-10 p-5">
          {records.map((game) => (
            <div
              key={game.game_id} // Use unique game_id
              className="rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition duration-1000 ease-out bg-gray-100 shadow-gray-700 p-6"
            >
              <h2 className="text-4xl font-semibold mb-3 text-opacity-100">
                {game.game_name}
              </h2>
              <p className="text-2xl font-extrabold mb-3">
                Price: KES {game.price}
              </p>
              <img
                src={game.image}
                alt={game.game_name}
                className="w-full rounded-xl h-auto mb-3"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <button
                onClick={() => handleAddToCart(game)} // Add game to cart
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
                  <li key={item.game_id} className="flex justify-between mb-2">
                    <span>
                      {item.game_name} (KES {item.price}) x
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={
                          (e) =>
                            handleQuantityChange(
                              item.game_id,
                              Number(e.target.value)
                            ) // Handle quantity change
                        }
                        className="w-16 ml-2 p-1 border rounded"
                      />
                    </span>
                    <button
                      className="text-red-600"
                      onClick={() => handleRemoveFromCart(item.game_id)} // Remove from cart
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
                onClick={handleMakeSale} // Handle making sale
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Make Sale
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCart(false)} // Close cart
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddGameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div
            className="bg-white p-16 lg:p-15 mt-44 lg:mt-20 rounded-lg"
            style={{ width: "800px", height: "auto" }}
          >
            <h2 className="text-3xl font-bold mb-6">Add New Game</h2>
            <form onSubmit={handleAddGame}>
              <div className="mb-6">
                <label
                  htmlFor="game_name"
                  className="block text-2xl font-bold mb-2"
                >
                  Game Name
                </label>
                <input
                  type="text"
                  id="game_name"
                  name="game_name"
                  value={newGameData.game_name}
                  onChange={handleNewGameDataChange}
                  className="input-field w-full p-4 bg-gray-200 rounded-md"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-2xl font-bold mb-2"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={newGameData.price}
                  onChange={handleNewGameDataChange}
                  className="input-field w-full p-4 bg-gray-200 rounded-md"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="image"
                  className="block text-2xl font-bold mb-2"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={newGameData.image}
                  onChange={handleNewGameDataChange}
                  className="input-field w-full p-4 bg-gray-200 rounded-md"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Game
                </button>
              </div>
            </form>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setShowAddGameModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
};

export default GameShop;
