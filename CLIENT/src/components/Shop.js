import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import LoadingSpinner from "./LoadingSpinner";

const Shop = () => {
  const [ records, setRecords ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const { handleAddToCart, totalPrice } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/item/getAllItems"
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="shop mt-36">
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
  );
};

export default Shop;
