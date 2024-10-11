const express = require("express");
const router = express.Router();
const {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} = require("../controller/PermissionController"); // Adjust the path as needed

// Define your routes
router.post("/", createPermission); // Create a new permission
router.get("/", getAllPermissions); // Get all permissions
router.get("/:id", getPermissionById); // Get a permission by ID
router.put("/:id", updatePermission); // Update a permission by ID
router.delete("/:id", deletePermission); // Delete a permission by ID

module.exports = router;
