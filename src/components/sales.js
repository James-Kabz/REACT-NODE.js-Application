import axios from "axios";
import { useEffect, useState } from "react";

const DisplaySales = () => {
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(8);


useEffect(() => {
    axios.get('http://localhost:4000/api/sale/getAllSales')
        .then(res => {
            let salesData = res.data;
            salesData.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));
            Promise.all(salesData.map(sale =>
                axios.get(`http://localhost:4000/api/game/getGame/${sale.game_id}`)
                    .then(res => ({ ...sale, game_name: res.data.game_name, image: res.data.image }))
            ))
                .then(updatedSales => {
                    setRecords(updatedSales);
                })
                .catch(err => {
                    console.error('Error fetching game names:', err);
                });
        })
        .catch(err => {
            if (err.response && err.response.status === 404) {
                console.log(err.response.data);
            } else {
                console.error('Error fetching sales data:', err);
            }
        });
}, []);
    
    
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="justify-center items-center mt-48 lg:mt-28 max-h-7xl ">
               <h1 className="text-5xl font-bold text-center mt-24">Sales Page</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 font-serif justify-between">
            {currentRecords.map((game, i) => (
                <div key={i} className=" rounded-lg overflow-hidden shadow-lg hover:shadow-lg transition duration-1000 ease-in-out bg-gray-100 shadow-gray-700 mx-6 mt-7 mb-7">
        <img src={game.image} alt={game.game_name} className="w-full h-48 object-cover" />
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 ">{game.game_name} - {game.price}</div>
            <p className=" mb-2">Quantity Sold: {game.quantity_sold}</p>
            <p className=" mb-2">Total Price: {game.total_price}</p>
            <p className=" mb-2">Sale Date: {new Date(game.sale_date).toLocaleDateString()}</p>
            {/* Use the above line to format the sale date */}
        </div>
    </div>
    ))}

            </div>
            <Pagination
                recordsPerPage={recordsPerPage}
                totalRecords={records.length}
                paginate={paginate}
            />
        </div>
    );
};

const Pagination = ({ recordsPerPage, totalRecords, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRecords / recordsPerPage); i++) {
        pageNumbers.push(i);
    }

return (
    <nav className="mt-4" aria-label="Pagination">
        <ul className="pagination flex justify-center text-center">
            <h1 className="text-3xl">Page </h1>
            {pageNumbers.map(number => (
                <li key={number} className="page-item">
                    <button 
                        onClick={() => paginate(number)} 
                        className="page-link text-4xl font-bold text-blue-500 hover:text-blue-700 focus:outline-none"
                        style={{ marginRight: "0.5rem" }} // Add margin to the right
                    >
                        {number}
                    </button>
                </li>
            ))}
        </ul>
    </nav>
);

};

export default DisplaySales;
