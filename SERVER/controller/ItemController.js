const db = require("../model/dbConnect");
const createHttpError = require("http-errors");
const { Item } = db;

module.exports = {
  addItem: async (req, res, next) => {
    try {
      let info = {
        item_name: req.body.item_name,
        quantity_in_stock: req.body.quantity_in_stock,
        price: req.body.price,
        image: req.body.image,
      };

      const addItem = await Item.create(info);
      res.status(200).send(addItem);
    } catch (error) {
      next(error);
    }
  },

  getItem: async (req, res, next) => {
    try {
      let id = req.params.id;
      let item = await Item.findOne({
        where: {
          id: id,
        },
      });
      if (!item) {
        throw createHttpError(404, "Item not found");
      }
      res.status(200).send(item);
    } catch (error) {
      next(error);
    }
  },
  getAllItems: async (req, res, next) => {
    try {
      let getAllItems = await Item.findAll();
      res.status(200).send(getAllItems);
    } catch (error) {
      next(error);
    }
  },

  updateItem: async (req, res, next) => {
    try {
      let id = req.params.id;

      const updateItem = await Item.update(req.body, {
        where: { id: id },
      });
      if (!Item) {
        throw createHttpError(404, "Item not found");
      }
      res.status(200).send(updateItem);
    } catch (error) {
      next(error);
    }
  },

  deleteItem: async (req, res, next) => {
    try {
      const id = req.params.id;

      const deleteItem = await Item.destroy({ where: { id: id } });

      if (deleteItem === 0) {
        throw createHttpError(404, "Item not found");
      }

      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
