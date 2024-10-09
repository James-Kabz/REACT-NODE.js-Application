import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth hook

function GameShop() {
  const [records, setGamesData] = useState([]);
  const { userRole } = useAuth();
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGameData, setNewGameData] = useState({
    game_name: '',
    price: '',
    image: ''
  }); // State to hold new game data

  useEffect(() => {
    axios.get('http://localhost:4000/api/game/getAllGames')
      .then(response => setGamesData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleAddGame = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post('http://localhost:4000/api/game/addGame', newGameData);
      console.log('New game added:', response.data);
     
      axios.get('http://localhost:4000/api/game/getAllGames')
        .then(response => setGamesData(response.data))
        .catch(error => console.error('Error fetching data:', error));
      setShowAddGameModal(false);
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };
  const handleNewGameDataChange = (e) => {
    const { name, value } = e.target;
    setNewGameData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="dashboard rounded-sm p-5 mt-20 lg:mt-20 ">
      <div className="container font-serif"> 
        <h1 className="text-3xl font-bold mb-6 mt-24 lg:mt-4 text-center">DashBoard</h1>
        {userRole === 'admin' && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-3 rounded"
            onClick={() => setShowAddGameModal(true)} 
          >
            Add Game
          </button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {records.map((game, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition duration-1000 ease-out bg-gray-100 shadow-gray-700 p-6 ">
              <h2 className="text-4xl font-semibold mb-3 text-opacity-100">{game.game_name}</h2>
              <p className="text-2xl font-extrabold mb-3">Price: KES {game.price}</p>
              <img
                src={game.image}
                alt={game.game_name}
                className="w-full rounded-xl h-auto mb-3"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
      {showAddGameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
  <div className="bg-white p-16 lg:p-20 mt-28 lg:mt-20 rounded-lg" style={{ width: '500px', height: 'auto' }}>
    <h2 className="text-4xl font-bold mb-6 text-center">Add New Game</h2>
    <form onSubmit={handleAddGame}>
      <div className="mb-6">
        <label htmlFor="game_name" className="block text-2xl font-bold mb-2">Game Name</label>
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
        <label htmlFor="quantity_in_stock" className="block text-2xl font-bold mb-2">Quantity</label>
        <input
          type="text"
          id="quantity_in_stock"
          name="quantity_in_stock"
          value={newGameData.quantity_in_stock}
          onChange={handleNewGameDataChange}
          className="input-field w-full p-4 bg-gray-200 rounded-md"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="price" className="block text-2xl font-bold mb-2">Price</label>
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
        <label htmlFor="image" className="block text-2xl font-bold mb-2">Image URL</label>
        <input
          type="text"
          id="image"
          name="image"
          value={newGameData.image}
          onChange={handleNewGameDataChange}
          className="input-field w-full p-4 bg-gray-200 rounded-md"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
        >
          Add Game
        </button>
        <button
          type="button"
          onClick={() => setShowAddGameModal(false)}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded ml-4"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>
      )}
    </div>
  );
}

export default GameShop;
