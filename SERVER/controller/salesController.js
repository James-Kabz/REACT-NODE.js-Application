const db = require('../model/dbConnect')
const sales = db.sales
// const {Game}  = require('../model/gamesModel')
const games = db.games
module.exports = {

    makeSale: async (req, res, next) => {
    try {
        let info = {
            quantity_sold: req.body.quantity_sold,
            total_price: req.body.total_price,
            game_id: req.body.game_id,
            sale_date: req.body.sale_date,
        };

        const game = await games.findOne({ where: { game_id: info.game_id } });
        if (!game) {
            return res.status(404).send({ message: "Game not found" });
        }

        if (info.quantity_sold > game.quantity_in_stock) {
            return res.status(400).send({ message: "Quantity sold exceeds quantity in stock" });
        }

        await games.decrement('quantity_in_stock', { by: info.quantity_sold, where: { game_id: info.game_id } });
        const makeSale = await sales.create(info);

        res.status(200).send(makeSale);
    } catch (error) {
        next(error);
    }
},


    //     try {
    //         let info = {
    //             quantity_sold: req.body.quantity_sold,
    //             total_price: req.body.total_price,
    //             game_id: req.body.game_id
    //         }

    //         await games.decrement('quantity_in_stock', {by:info.quantity_sold, where: {game_id: info.game_id} })
    //         const makeSale = await
    //             sales.create(info)
    //         res.status(200).send(makeSale)
    //     } catch (error) {
    //         next(error)
    //     }
    // },
getAllSales: async (req, res, next) => {
    try {
        let getAllSales = await sales.findAll({
            include: [{
                model: games,
                attributes: ['game_name']
            }],
            order: [
                ['sale_date', 'DESC'] // Sort by sale_date in descending order
            ]
        });
        res.status(200).send(getAllSales);
    } catch (error) {
        next(error);
    }
},


}