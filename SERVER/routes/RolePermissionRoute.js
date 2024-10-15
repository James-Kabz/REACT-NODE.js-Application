const express = require("express");
const router = express.Router();

const RolePermissionController = require("../controller/RolePermissionController");

// Role-Permission routes
router.post(
  "/assignPermissionToRole",
  RolePermissionController.assignPermissionToRole
);
router.get(
  "/getPermissionsForRole/:roleId",
  RolePermissionController.getPermissionsForRole
);

router.delete(
  "/removePermissionFromRole",
  RolePermissionController.removePermissionFromRole
);

module.exports = router;
