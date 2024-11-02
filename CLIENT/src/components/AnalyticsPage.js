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
