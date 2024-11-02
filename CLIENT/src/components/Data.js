import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toast
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "./AuthContext";

const DataPage = () => {
  const [sales, setSales] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();
  
  const handleSearch = (e) => {
    setLoading(true);
    e.preventDefault();
    history.push(`/Data?sale_date=${searchQuery}`);
  };

  // Using useCallback to memoize fetchSales
  const fetchSales = useCallback(async () => {
    const query = new URLSearchParams(location.search);
    const saleDate = query.get("sale_date");

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/sale/getAllSales"
      );
      const salesData = response.data;

      let filteredSales = salesData;
      if (saleDate) {
        filteredSales = salesData.filter((sale) => {
          const saleDateString = new Date(sale.sale_date).toLocaleDateString();
          const searchDateString = new Date(saleDate).toLocaleDateString();
          return saleDateString === searchDateString;
        });
      }

      const salesWithItemData = await Promise.all(
        filteredSales.map(async (sale) => {
          const itemResponse = await axios.get(
            `http://localhost:4000/api/item/getItem/${sale.item_id}`
          );
          return {
            ...sale,
            item_name: itemResponse.data.item_name,
            image: itemResponse.data.image,
          };
        })
      );

      setSales(salesWithItemData);
    } catch (error) {
      console.error("Error fetching sales", error);
      toast.error("Failed to fetch sales. Please try again.", {
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
  }, [location.search]); // Only re-run when location.search changes

  useEffect(() => {
    fetchSales();
  }, [fetchSales]); // fetchSales is stable due to useCallback

  const handleDelete = async () => {
    if (!selectedSale) return;

    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:4000/api/sale/deleteSale/${selectedSale.id}`
      );
      toast.success("Sale Deleted successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      fetchSales(); // Refresh sales data after deletion
      setShowDeleteModal(false);
      setSelectedSale(null);
    } catch (error) {
      toast.error("Failed to delete sale. Please try again.", {
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

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedSale(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="lg:mt-24 sm:mt-20 mx-4 lg:mx-10 space-y-8">
      {/* Search Form */}
      <div className="flex-grow">
        <form
          className="flex items-center justify-center lg:justify-start w-full space-x-2"
          onSubmit={handleSearch}
        >
          <input
            type="date"
            placeholder="Search by Date"
            className="bg-gray-100 border border-gray-300 rounded-md py-3 px-4 w-full lg:w-96 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-lime-600 text-white font-semibold rounded-md py-3 px-6 hover:bg-lime-500 transition duration-300 ease-in-out"
          >
            Search
          </button>
        </form>
      </div>

      {/* Page Title */}
      <h2 className="text-3xl font-semibold mb-6 text-center lg:text-left text-gray-800">
        Sales on {new URLSearchParams(location.search).get("sale_date")}
      </h2>

      {/* Sales Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            <img
              src={sale.image}
              alt={sale.item_name}
              className="w-full h-52 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {sale.item_name}
              </h3>
              <p className="text-gray-600">
                <strong>Quantity Sold:</strong> {sale.quantity_sold}
              </p>
              <p className="text-gray-600">
                <strong>Total Price:</strong> ${sale.total_price.toFixed(2)}
              </p>
              <p className="text-gray-600">
                <strong>Sale Date:</strong>{" "}
                {new Date(sale.sale_date).toLocaleDateString()}
              </p>

              {hasPermission("delete_sale") && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mt-3 transition-colors duration-200 ease-in-out"
                  onClick={() => {
                    setSelectedSale(sale);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-auto shadow-lg transform scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete this sale?
            </p>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
              >
                Delete
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default DataPage;
