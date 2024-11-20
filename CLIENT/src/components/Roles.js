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

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [, setRoleId] = useState("");
  const { hasPermission } = useAuth();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchRoles();
    fetchUsers();
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
