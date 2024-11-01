import React from "react";
import axios from "axios";

const DeleteSale = ({ sale, onClose, onDelete }) => {
  const token = sessionStorage.getItem("accessToken");

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/item/deleteSale/${sale.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onDelete();
      onClose();
    } catch (err) {
      console.log("Error deleting sale:", err);
    }
  };

  return (
    <div className="w-full text-sm text-gray-500 mt-3">
      <p className="mb-4">Are you sure you want to delete this sale?</p>
      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteSale;
