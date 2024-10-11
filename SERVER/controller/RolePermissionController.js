const { where } = require("sequelize");
const createHttpError = require("http-errors");
const db = require("../model/dbConnect");
const RolePermissions = require("../model/RolePermissions");
const RolePermission = db.rolePermissions; // Assuming you have defined this in your db connection
const Role = db.roles; // Import Role model
const Permission = db.permissions; // Import Permission model

module.exports = {
  // Assign permission to a role
  assignPermissionToRole: async (req, res, next) => {
    try {
      const { roleId, permissionId } = req.body;
      const rolePermission = await RolePermissions.create({
        roleId,
        permissionId,
      });
      res.status(201).json(rolePermission);
    } catch (error) {
      next(createHttpError(500, "Failed to assign permission to role"));
    }
  },

  // Get all permissions assigned to a role
  getPermissionsForRole: async (req, res, next) => {
    try {
      const { roleId } = req.params;
      const rolePermissions = await RolePermission.findAll({
        where: { roleId },
        include: [{ model: Permission, as: "permission" }],
      });
      res.status(200).json(rolePermissions);
    } catch (error) {
      next(createHttpError(500, "Failed to retrieve role permissions"));
    }
  },

  // Get all roles assigned to a permission
  getRolesForPermission: async (req, res, next) => {
    try {
      const { permissionId } = req.params;
      const permissionRoles = await RolePermission.findAll({
        where: { permissionId },
        include: [{ model: Role, as: "role" }],
      });
      res.status(200).json(permissionRoles);
    } catch (error) {
      next(createHttpError(500, "Failed to retrieve permission roles"));
    }
  },

  // Remove permission from role
  removePermissionFromRole: async (req, res, next) => {
    try {
      const { roleId, permissionId } = req.body;
      const rolePermission = await RolePermission.findOne({
        where: { roleId, permissionId },
      });
      if (!rolePermission) {
        return next(
          createHttpError(404, "Role-Permission association not found")
        );
      }
      await rolePermission.destroy();
      res.status(204).send();
    } catch (error) {
      next(createHttpError(500, "Failed to remove permission from role"));
    }
  },
};
