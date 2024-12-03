import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";
import AddUserModal from "../auth/AddUserModal";
import {
  addRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../FirebaseFunctions/RoleFunctions";
import CustomModal from "./CustomModal";
import { showToast } from "./ToastMessage";
import { FaSpinner } from "react-icons/fa";
import { getPermissions } from "../FirebaseFunctions/PermissionFunction";
import { assignPermissionsToRole, getPermissionsForRole, updatePermissionsForRole } from "../FirebaseFunctions/RolePermissions";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);



  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [, setRoleId] = useState("");
  const { hasPermission } = useAuth();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchRoles();
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const roles = await getRoles();
      setRoles(roles);
    } catch (error) {
      showToast.error("Failed to fetch roles");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/getUsers"
      );
      setUsers(response.data);
    } catch (error) {
      showToast.error("Failed to fetch users");
    }
  };

  const fetchPermissions = async () => {
    try {
      const fetchedPermissions = await getPermissions();
      setPermissions(fetchedPermissions);
    } catch (error) {
      showToast.error("Failed to fetch permissions");
      setPermissions([])
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This will now work properly as it's attached to a form submission event
    if (loading) return;
    setLoading(true);

    try {
      if (isEditing) {
        await updateRole(editId, roleName);
        showToast.success("Role updated successfully!");
      } else {
        const newRoleId = await addRole(roleName);
        setRoles([...roles, { id: newRoleId, roleName }]); // Add new role to state
        showToast.success("Role added successfully!");
      }
      resetForm();
    } catch (error) {
      showToast.error(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId) => {
    setLoading(true);
    try {
      await deleteRole(roleId);
      setRoles(roles.filter((role) => role.id !== roleId));
      showToast.success("Role deleted successfully!");
      closeDeleteModal();
    } catch (error) {
      showToast.error(error.message || "Failed to delete role.");
    } finally {
      setLoading(false);
    }
  };


  // permissions to role
const handleAssignOrUpdatePermissions = async () => {
  if (!selectedRoleId) return;

  try {
    const existingPermissions = await fetchPermissionsForRole(selectedRoleId);

    if (existingPermissions.length === 0) {
      // Assign permissions if no permissions are currently assigned
      await assignPermissionsToRole(selectedRoleId, selectedPermissions);
      showToast.success("Permissions assigned successfully!");
    } else {
      // Update permissions if there are existing permissions
      await updatePermissionsForRole(selectedRoleId, selectedPermissions);
      showToast.success("Permissions updated successfully!");
    }

    closePermissionModal();
  } catch (error) {
    showToast.error(error.message || "Failed to assign or update permissions.");
  }
};


// const handleUpdatePermissions = async () => {
//   if (!selectedRoleId) return;
//   try {
//     await updatePermissionsForRole(selectedRoleId, selectedPermissions);
//     showToast.success("Permissions updated successfully!");
//     closePermissionModal();
//   } catch (error) {
//     showToast.error("Failed to update permissions.");
//   }
// };

const fetchPermissionsForRole = async (roleId) => {
  try {
    const permissions = await getPermissionsForRole(roleId);
    if (!permissions || !Array.isArray(permissions)) {
      setSelectedPermissions([]); // Fallback to empty array if no permissions found
      showToast.info("No permissions assigned to this role yet.");
      return;
    }
    setSelectedPermissions(permissions.map((perm) => perm.id)); // Map permissions to IDs
  } catch (error) {
    console.error("Failed to fetch permissions for role:", error.message);
    showToast.error("Failed to fetch permissions for this role.");
  }
};



const openPermissionModal = async (roleId) => {
  try {
    setSelectedRoleId(roleId);
    const rolePermissions = await getPermissionsForRole(roleId);

    if (!rolePermissions || !Array.isArray(rolePermissions)) {
      setSelectedPermissions([]); // No permissions assigned
      showToast.info("No permissions assigned to this role yet.");
    } else {
      setSelectedPermissions(rolePermissions.map((perm) => perm.id)); // Assuming permission IDs are returned
    }

    setIsPermissionModalOpen(true);
  } catch (error) {
    console.error("Error fetching permissions for role:", error.message);
    showToast.error("Failed to fetch role permissions.");
  }
};




  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    // setCurrentRoleId(null);
    // setSelectedPermissions([]);
  };
  const openDeleteModal = (role) => {
    setRoleToDelete(role); // Set the role to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // Close the modal
    setRoleToDelete(null); // Reset the roleToDelete
  };

  const openAddUserModal = () => {
    // route for add user modal
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setRoleId("");
  };

  const resetForm = () => {
    setRoleName("");
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="max-w-7xl max-h-7xl  mx-auto mt-32 p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Manage Roles
      </h2>

      {hasPermission("add_user") && (
        <button
          onClick={openAddUserModal}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition duration-200"
        >
          Add User
        </button>
      )}

      {isAddUserModalOpen && (
        <AddUserModal
          isAddUserModalOpen={isAddUserModalOpen}
          closeAddUserModal={closeAddUserModal}
          roles={roles}
          fetchUsers={fetchUsers}
        />
      )}

      {hasPermission("add_role") && (
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block text-gray-700">
            Role Name:
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              className="border text-blue-950 border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          {isEditing && (
            <button
              onClick={resetForm}
              className="mt-2 w-full bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition duration-200"
            >
              Cancel Edit
            </button>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <span>{isEditing ? "Update Role" : "Add Role"}</span>
            )}
          </button>
        </form>
      )}

      <ul>
        {roles.map((role) => (
          <li
            key={role.id}
            className="flex justify-between items-center mb-2 p-2 border border-gray-200 rounded-lg bg-gray-100"
          >
            <span className="text-gray-800">{role.roleName}</span>
            <div>
              {hasPermission("edit_role") && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditId(role.id);
                    setRoleName(role.roleName); // Pre-fill the form with the current role name
                  }}
                  className="bg-yellow-500 text-white rounded px-2 py-1 mr-2 hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
              )}

              {hasPermission("delete_role") && (
                <button
                  onClick={() => openDeleteModal(role)}
                  className="bg-red-500 text-white rounded px-2 py-1 mr-2 hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              )}

              <button
                onClick={() => openPermissionModal(role.id)}
                className="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600 transition duration-200"
              >
                Manage Permissions
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-bold text-blue-500 mt-6 mb-2">Users</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center mb-2 p-2 border border-gray-200 rounded-lg bg-gray-100"
          >
            <span className="text-gray-800">
              {user.email} - {user.role.roleName}
            </span>
            <div></div>
          </li>
        ))}
      </ul>

      <CustomModal
        isOpen={isPermissionModalOpen}
        onClose={closePermissionModal}
        title="Manage Permissions"
        footerButtons={[
          {
            label: "Cancel",
            onClick: closePermissionModal,
            className:
              "bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600",
          },
          {
            label: "Save Permissions",
            onClick: handleAssignOrUpdatePermissions,
            className:
              "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
          },
        ]}
      >
        {permissions && permissions.length > 0 ? (
          permissions.map((permission) => (
            <div key={permission.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission.id)}
                onChange={(e) => {
                  const updatedPermissions = e.target.checked
                    ? [...selectedPermissions, permission.id]
                    : selectedPermissions.filter((id) => id !== permission.id);
                  setSelectedPermissions(updatedPermissions);
                }}
                className="mr-2"
              />
              <span>{permission.permissionName}</span>
            </div>
          ))
        ) : (
          <p>No permissions available to assign</p>
        )}
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Role"
        loading={loading}
        footerButtons={[
          {
            isLoading: false,
            label: "Cancel",
            onClick: closeDeleteModal,
            className:
              "bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600",
          },
          {
            isLoading: true,
            label: "Delete",
            onClick: () => handleDelete(roleToDelete?.id),
            className:
              "bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600",
          },
        ]}
      >
        <p>
          Are you sure you want to delete the role "{roleToDelete?.roleName}"?
        </p>
      </CustomModal>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        newestOnTop={true}
      />
    </div>
  );
};

export default RolesPage;
