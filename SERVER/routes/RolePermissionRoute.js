const express = require("express");
const router = express.Router();

const RolePermissionController = require("../controller/RolePermissionController");

// Role-Permission routes
router.post(
  "/role-permission",
  RolePermissionController.assignPermissionToRole
);
router.get(
  "/role-permission/role/:roleId",
  RolePermissionController.getPermissionsForRole
);
router.get(
  "/role-permission/permission/:permissionId",
  RolePermissionController.getRolesForPermission
);
router.delete(
  "/role-permission",
  RolePermissionController.removePermissionFromRole
);

module.exports = router;
