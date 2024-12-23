const db = require("../model/dbConnect");
const { Sale, Item } = db;

module.exports = {
  makeSale: async (req, res, next) => {
    try {
      let info = {
        quantity_sold: req.body.quantity_sold,
        total_price: req.body.total_price,
        item_id: req.body.item_id,
        sale_date: req.body.sale_date,
      };

      const item = await Item.findOne({ where: { id: info.item_id } });
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }

      if (info.quantity_sold > item.quantity_in_stock) {
        return res
          .status(400)
          .send({ message: "Quantity sold exceeds quantity in stock" });
      }

      await Item.decrement("quantity_in_stock", {
        by: info.quantity_sold,
        where: { id: info.item_id },
      });
      const makeSale = await Sale.create(info);

      res.status(200).send(makeSale);
    } catch (error) {
      next(error);
    }
  },

  getAllSales: async (req, res, next) => {
    try {
      let getAllSales = await Sale.findAll({
        include: [
          {
            model: Item,
            attributes: ["item_name"],
          },
        ],
        order: [["sale_date", "DESC"]],
      });
      res.status(200).send(getAllSales);
    } catch (error) {
      next(error);
    }
  },

  deleteSale: async (req, res, next) => {
    try {
      const id = req.params.id;

      const deleteSale = await Sale.destroy({ where: { id: id } });

      if (deleteSale === 0) {
        throw createHttpError(404, "Sale not found");
      }

      res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
