const createHttpError = require("http-errors");
const db = require("../model/dbConnect");
const Permission = db.permissions; // Ensure you import the correct model

module.exports = {

  createPermission: async (req, res, next) => {
    try {
      const { permissionName } = req.body;
      const permission = await Permission.create({ permissionName });
      res.status(201).json(permission);
    } catch (error) {
      next(createHttpError(500, "Failed to create permission"));
    }
  },

  // Get all permissions
  getAllPermissions: async (req, res, next) => {
    try {
      const permissions = await Permission.findAll();
      res.status(200).json(permissions);
    } catch (error) {
      next(createHttpError(500, "Failed to retrieve permissions"));
    }
  },

  // Get a permission by ID
  getPermissionById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const permission = await Permission.findByPk(id);
      if (!permission) {
        return next(createHttpError(404, "Permission not found"));
      }
      res.status(200).json(permission);
    } catch (error) {
      next(createHttpError(500, "Failed to retrieve permission"));
    }
  },

  // Update a permission by ID
  updatePermission: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { permissionName } = req.body;
      const permission = await Permission.findByPk(id);
      if (!permission) {
        return next(createHttpError(404, "Permission not found"));
      }
      permission.permissionName = permissionName;
      await permission.save();
      res.status(200).json(permission);
    } catch (error) {
      next(createHttpError(500, "Failed to update permission"));
    }
  },

  // Delete a permission by ID
  deletePermission: async (req, res, next) => {
    try {
      const { id } = req.params;
      const permission = await Permission.findByPk(id);
      if (!permission) {
        return next(createHttpError(404, "Permission not found"));
      }
      await permission.destroy();
      res.status(204).send();
    } catch (error) {
      next(createHttpError(500, "Failed to delete permission"));
    }
  },
};
