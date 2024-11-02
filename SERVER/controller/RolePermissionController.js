// const { RolePermission, Role, Permission } = require("../model/dbConnect"); // Adjust path to your models
const { where } = require("sequelize");
const db = require("../model/dbConnect");
const createHttpError = require("http-errors");
const { Role, Permission,RolePermission } = db;
// Assign a permission to a role
module.exports = {
  assignPermissionToRole: async (req, res, next) => {
    try {
      const { roleId, permissionId } = req.body;

      // Check if the role already has the permission
      const existingPermission = await RolePermission.findOne({
        where: {
          roleId: roleId,
          permissionId: permissionId,
        },
      });

      if (existingPermission) {
        // If permission already exists, return a message and skip creating a new one
        return res.status(200).json({
          message: `Permission with ID ${permissionId} is already assigned to role with ID ${roleId}.`,
        });
      }

      // If permission doesn't exist, proceed with creating it
      const assignPermissionToRole = await RolePermission.create({
        roleId: roleId,
        permissionId: permissionId,
      });

      return res.status(201).json(assignPermissionToRole);
    } catch (error) {
      next(error);
    }
  },

  // Get all permissions for a specific role
  getPermissionsForRole: async (req, res, next) => {
    // const { roleId } = req.params;

    try {
      let id = req.params.roleId;
      let rolePermission = await RolePermission.findAll({
        where: {
          roleId: id,
        },
      });
      if (!Role) {
        throw createHttpError(404, "Permissions To Role Not Found");
      }
      res.status(201).send(rolePermission);
    } catch (error) {
      next(error);
    }
  },

  // Remove permission from role
  removePermissionFromRole: async (req, res, next) => {
    try {
      const { roleId, permissionId } = req.body;

      // Find the permission entry
      const permission = await RolePermission.findOne({
        where: {
          roleId: roleId,
          permissionId: permissionId,
        },
      });

      // If it doesn't exist, return an error
      if (!permission) {
        return res.status(404).json({
          message: `Permission with ID ${permissionId} is not assigned to role with ID ${roleId}.`,
        });
      }

      // Remove the permission from the role
      await permission.destroy();

      return res.status(200).json({
        message: `Permission with ID ${permissionId} has been removed from role with ID ${roleId}.`,
      });
    } catch (error) {
      next(error);
    }
  },
  
};
