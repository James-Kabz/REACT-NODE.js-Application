import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toast

const DataPage = () => {
  const [sales, setSales] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/Data?sale_date=${searchQuery}`);
  };

  // Using useCallback to memoize fetchSales
  const fetchSales = useCallback(async () => {
    const query = new URLSearchParams(location.search);
    const saleDate = query.get("sale_date");

    try {
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
    }
  }, [location.search]); // Only re-run when location.search changes

  useEffect(() => {
    fetchSales();
  }, [fetchSales]); // fetchSales is stable due to useCallback

  const handleDelete = async () => {
    if (!selectedSale) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/sale/deleteSale/${selectedSale.id}`
      );
      toast.success("Sale Deleted successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      fetchSales(); // Refresh sales data after deletion
      setShowDeleteModal(false);
      setSelectedSale(null);
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Failed to delete sale. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedSale(null);
  };

  return (
    <div className="container mx-auto mt-10 p-5 sm:p-0 lg:mt-10">
      {/* Search Form */}
      <div className="flex-grow">
        <form
          className="flex items-center justify-center lg:justify-start w-full"
          onSubmit={handleSearch}
        >
          <input
            type="date"
            placeholder="Search by Date"
            className="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 w-full lg:w-96 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-300 ease-in-out"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-lime-600 text-white font-semibold rounded-md py-2 px-4 hover:bg-lime-500 transition duration-300 ease-in-out"
          >
            Search
          </button>
        </form>
      </div>
      <h2 className="text-3xl font-semibold mb-6">
        Sales on {new URLSearchParams(location.search).get("sale_date")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={sale.image}
              alt={sale.item_name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2">{sale.item_name}</h3>
              <p>
                <strong>Quantity Sold:</strong> {sale.quantity_sold}
              </p>
              <p>
                <strong>Total Price:</strong> {sale.total_price}
              </p>
              <p>
                <strong>Sale Date:</strong>{" "}
                {new Date(sale.sale_date).toLocaleDateString()}
              </p>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3"
                onClick={() => {
                  setSelectedSale(sale);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this sale?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Delete
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
};

export default DataPage;
