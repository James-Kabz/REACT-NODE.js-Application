import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditGame from './EditGame';
import DeleteGame from './deleteGame';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function GameShop() {
  const [records, setGamesData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const fetchGamesData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/game/getAllGames');
      setGamesData(response.data);
      calculateTotalValue(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchGamesData();
  }, [fetchGamesData]);

  const calculateTotalValue = (games) => {
    let total = 0;
    games.forEach(game => {
      total += game.price * game.quantity_in_stock;
    });
    setTotalValue(total);
  };

  const handleUpdateGame = async () => {
    await fetchGamesData();
    toast.success('Game updated successfully!');
  };

  const handleDeleteGame = async () => {
    await fetchGamesData();
    toast.success('Game deleted successfully!');
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="dashboa p-5 mt-48 lg:mt-28">
      <div className="container font-serif">
        <h1 className="text-3xl font-bold mb-6 text-center">Sales Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {records.map((game, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition duration-1000 ease-out bg-gray-100 shadow-gray-600 p-6 ">
              <h2 className="text-4xl font-semibold mb-3">{game.game_name}</h2>
              <p className="text-2xl mb-2">Stock: {game.quantity_in_stock}</p>
              <p className="text-2xl">Price: KES {game.price}</p>
              <img src={game.image} alt={game.game_name} className="w-full rounded-xl h-auto mb-3" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
              <div className="flex space-x-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setSelectedGame(game); setShowUpdateModal(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setSelectedGame(game); setShowDeleteModal(true); }}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-gray-600 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-3xl font-semibold mb-3">Total Value of Games in Stock</h2>
          <p className="text-2xl">KES {totalValue}</p>
        </div>
      </div>
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="bg-white p-9 mt-5 lg:ml-20 rounded-lg max-w-sm lg:max-w-3xl w-full">
            <h2 className="text-3xl font-bold text-center mt-44 lg:mt-auto">Update Game</h2>
            <EditGame game={selectedGame} onClose={handleCloseUpdateModal} onUpdate={handleUpdateGame} />
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Delete Game</h2>
            <DeleteGame game={selectedGame} onClose={handleCloseDeleteModal} onDelete={handleDeleteGame} />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default GameShop;
