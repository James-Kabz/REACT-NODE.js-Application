import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditItem from "./EditItem";
import DeleteItem from "./DeleteItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "./AuthContext";

function CommerceShop() {
  const [records, setItemsData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();
  const [gameDetails, setGameDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // RAWG search results
  const [showGameSearchModal, setShowGameSearchModal] = useState(false); // Game Search Modal visibility
  const RAWG_API_KEY = "48c8f1dcb24a41298c867ab063f3f85f"; // Replace with your RAWG API key
  const { userRole } = useAuth();

  const fetchItemsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/item/getAllItems"
      );
      setItemsData(response.data);
      calculateTotalValue(response.data);
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItemsData();
  }, [fetchItemsData]);

  const handleGameSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: RAWG_API_KEY,
          search: searchTerm,
        },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      toast.error("Error fetching game data:", {
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
  };

  const handleSaveGame = async (game) => {
    const gameId = game.id;
    const { price, quantity_in_stock } = gameDetails[gameId] || {};

    // Ensure that price and quantity are set
    if (!price || !quantity_in_stock) {
      toast.error("Please enter price and quantity.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      return;
    }

    const gameData = {
      item_name: game.name,
      price: parseFloat(price),
      image: game.background_image,
      quantity_in_stock: parseInt(quantity_in_stock, 10),
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/item/addItem",
        gameData
      );
      setItemsData((prevItems) => [...prevItems, response.data]);
      toast.success(`${game.name} saved successfully!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      setShowGameSearchModal(false);
    } catch (error) {
      console.error("Error saving game:", error);
      toast.error("Error saving game.", {
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
  const calculateTotalValue = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity_in_stock;
    });
    setTotalValue(total);
  };

  const handleUpdateItem = async () => {
    await fetchItemsData();
    toast.success(`Updated successfully`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnFocusLoss: false,
      draggable: true,
      newestOnTop: true,
    });
  };

  const handleDelete = async () => {
    await fetchItemsData();
    toast.success(`Deleted successfully`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnFocusLoss: false,
      draggable: true,
      newestOnTop: true,
    });
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="lg:mt-24 sm:mt-20 mx-4 lg:mx-10">
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
          <div className="bg-white p-6 rounded-lg max-w-lg w-full md:max-w-3xl lg:max-w-4xl shadow-lg mx-4 overflow-y-auto max-h-screen">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto p-4 max-h-96">
              {searchResults.length > 0 ? (
                searchResults.map((game) => (
                  <div
                    key={game.id}
                    className="rounded-lg overflow-hidden shadow-md bg-gray-100 p-4 flex flex-col items-center"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-center">
                      {game.name}
                    </h3>
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-32 md:h-48 object-cover rounded-md"
                    />

                    <label className="mt-2 font-medium">Price (KES):</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={gameDetails[game.id]?.price || ""}
                      onChange={(e) => handleInputChange(e, game.id)}
                      className="border rounded-md p-1 mt-1 w-full"
                    />

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
                <p className="text-center col-span-full text-gray-700">
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
      {/* Total Stock Value Card */}
      <div className="lg:max-w-lg mx-auto bg-blue-500 rounded-lg shadow-md p-6 text-white mb-8">
        <h2 className="text-xl lg:text-2xl font-extrabold mb-3 text-center lg:text-left">
          Total Value of Items in Stock
        </h2>
        <p className="text-xl lg:text-2xl text-center lg:text-left">
          KES {totalValue}
        </p>
      </div>

      {/* Sales Analysis Header */}
      <h1 className="text-3xl font-bold mb-8 text-center">Sales Analysis</h1>

      {/* Grid of Item Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full lg:max-w-7xl mx-auto px-2">
        {records.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-out bg-gray-100 p-6"
          >
            <h2 className="text-xl lg:text-2xl font-extrabold mb-3 text-center lg:text-left">
              {item.item_name}
            </h2>
            <p className="text-lg lg:text-xl mb-2 text-center lg:text-left">
              Stock: {item.quantity_in_stock}
            </p>
            <p className="text-lg lg:text-xl text-center lg:text-left">
              Price: KES {item.price}
            </p>
            <img
              src={item.image}
              alt={item.item_name}
              className="w-full rounded-xl mb-3"
              style={{ height: "250px", objectFit: "cover" }}
            />
            <div className="flex justify-center lg:justify-start space-x-4">
              {hasPermission("edit_item") && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowUpdateModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}

              {hasPermission("delete_item") && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDeleteModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}

      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg max-w-full sm:max-w-md lg:max-w-lg w-full mx-4">
            <h2 className="text-3xl font-bold text-center mb-4">Update Item</h2>
            <EditItem
              item={selectedItem}
              onClose={handleCloseUpdateModal}
              onUpdate={handleUpdateItem}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg max-w-full sm:max-w-md lg:max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Delete Item
            </h2>
            <DeleteItem
              item={selectedItem}
              onClose={handleCloseDeleteModal}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default CommerceShop;
