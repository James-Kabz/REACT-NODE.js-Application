import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const DataPage = () => {
    const [sales, setSales] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchSales = async () => {
            const query = new URLSearchParams(location.search);
            const saleDate = query.get('sale_date');

            try {
                const response = await axios.get('http://localhost:4000/api/sale/getAllSales');
                const salesData = response.data;

                let filteredSales = salesData;
                if (saleDate) {
                    filteredSales = salesData.filter(sale => {
                        const saleDateString = new Date(sale.sale_date).toLocaleDateString();
                        const searchDateString = new Date(saleDate).toLocaleDateString();
                        return saleDateString === searchDateString;
                    });
                }

                const salesWithGameData = await Promise.all(filteredSales.map(async sale => {
                    const gameResponse = await axios.get(`http://localhost:4000/api/game/getGame/${sale.game_id}`);
                    return {
                        ...sale,
                        game_name: gameResponse.data.game_name,
                        image: gameResponse.data.image
                    };
                }));

                setSales(salesWithGameData);
            } catch (error) {
                console.error('Error fetching sales', error);
            }
        };

        fetchSales();
    }, [location.search]);

    return (
        <div className="container mx-auto mt-48 lg:mt-28 px-4">
            <h2 className="text-3xl font-semibold mb-6">Sales on {new URLSearchParams(location.search).get('sale_date')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sales.map(sale => (
                    <div key={sale.id} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                        <img src={sale.image} alt={sale.game_name} className="w-full h-48 object-cover" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold mb-2">{sale.game_name}</h3>
                            <p><strong>Quantity Sold:</strong> {sale.quantity_sold}</p>
                            <p><strong>Total Price:</strong> {sale.total_price}</p>
                            <p><strong>Sale Date:</strong> {new Date(sale.sale_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataPage;
