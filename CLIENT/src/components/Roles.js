import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "./AuthContext";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [previousPermissions, setPreviousPermissions] = useState([]);

  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false); // Delete User Modal
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Track user to delete
  const [userToEdit, setUserToEdit] = useState(null);
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchRoles();
    fetchUsers();
    fetchPermissions(); // Fetch permissions on component mount
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/roles");
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/permissions");
      setPermissions(response.data);
    } catch (error) {
      toast.error("Failed to fetch permissions");
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/getUsers"
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateRole(editId, roleName);
    } else {
      await addRole(roleName);
    }
  };

  const addRole = async (roleName) => {
    try {
      const response = await axios.post("http://localhost:4000/api/roles", {
        roleName: roleName,
      });
      setRoles([...roles, response.data]);
      toast.success("Role added successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      resetForm();
    } catch (error) {
      toast.error("Failed to add role", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const updateRole = async (id, roleName) => {
    try {
      await axios.put(`http://localhost:4000/api/roles/${id}`, {
        roleName: roleName,
      });
      const updatedRoles = roles.map((r) =>
        r.id === id ? { ...r, roleName: roleName } : r
      );
      setRoles(updatedRoles);
      toast.success("Role updated successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      resetForm();
    } catch (error) {
      toast.error("Failed to update role", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const handleEdit = (role) => {
    setRoleName(role.roleName);
    setIsEditing(true);
    setEditId(role.id);
  };

  const openDeleteModal = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const deleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/roles/${id}`);
      setRoles(roles.filter((role) => role.id !== id));
      toast.success("Role deleted successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete role", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const resetForm = () => {
    setRoleName("");
    setIsEditing(false);
    setEditId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  // Function to open permission modal
  const openPermissionModal = (roleId) => {
    setCurrentRoleId(roleId);
    setSelectedPermissions([]);
    fetchPermissionsForRole(roleId); // Fetch permissions for the selected role
    setIsPermissionModalOpen(true);
  };

  const fetchPermissionsForRole = async (roleId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/rolePermission/getPermissionsForRole/${roleId}`
      );

      setPreviousPermissions(response.data.map((p) => p.permissionId)); // Save previous permissions
      // Extract permission IDs from the response
      setSelectedPermissions(response.data.map((p) => p.permissionId)); // Adjust according to API response
    } catch (error) {
      toast.error("Failed to fetch permissions for the role", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const assignPermissionsToRole = async () => {
    try {
      let successCount = 0;
      let skipCount = 0;
      let removedCount = 0;

      // Assuming you have arrays: `selectedPermissions` (currently selected)
      // and `previousPermissions` (permissions before the update)

      // Get the permissions that were deselected
      const deselectedPermissions = previousPermissions.filter(
        (permissionId) => !selectedPermissions.includes(permissionId)
      );

      // Assign new permissions
      for (let permissionId of selectedPermissions) {
        const response = await axios.post(
          "http://localhost:4000/api/rolePermission/assignPermissionToRole",
          {
            roleId: currentRoleId,
            permissionId,
          }
        );

        // Check if the permission was newly added or already exists
        if (response.data.message?.includes("already assigned")) {
          skipCount++;
        } else {
          successCount++;
        }
      }

      // Remove deselected permissions
      for (let permissionId of deselectedPermissions) {
        const response = await axios.delete(
          "http://localhost:4000/api/rolePermission/removePermissionFromRole",
          {
            data: {
              roleId: currentRoleId,
              permissionId,
            },
          }
        );

        if (response.status === 200) {
          removedCount++;
        }
      }

      // Display appropriate toast messages based on results
      if (successCount > 0) {
        toast.success(`permissions updated successfully!`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          newestOnTop: true,
        });
      }
      // if (skipCount > 0) {
      //   toast.info(`${skipCount} permissions were already assigned.`);
      // }
      if (removedCount > 0) {
        toast.success(`permissions removed from the role.`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          newestOnTop: true,
        });
      }

      closePermissionModal();
    } catch (error) {
      toast.error("Failed to update permissions for the role", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setCurrentRoleId(null);
    setSelectedPermissions([]);
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionId)
        ? prevSelected.filter((id) => id !== permissionId)
        : [...prevSelected, permissionId]
    );
  };

  // Handle adding a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:4000/api/user/addUser", {
        email,
        password,
        roleId,
      });
      toast.success("User added successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      fetchUsers();
      closeAddUserModal();
    } catch (error) {
      toast.error("Failed to add user", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRoleId("");
  };

  // Handle deleting user
  const openDeleteUserModal = (user) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/user/deleteUser/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      closeDeleteUserModal();
    } catch (error) {
      toast.error("Failed to delete user", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const closeDeleteUserModal = () => {
    setIsDeleteUserModalOpen(false);
    setUserToDelete(null);
  };

  // Handle editing user
  // const openEditUserModal = (user) => {
  // //   setUserToEdit(user);
  // //   setEmail(user.email);
  // //   setRoleId(user.role.id);
  // //   setIsEditUserModalOpen(true);
  // // };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/user/updateUser/${userToEdit.id}`,
        {
          email,
          password,
          roleId,
        }
      );
      toast.success("User updated successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      fetchUsers();
      closeEditUserModal();
    } catch (error) {
      toast.error("Failed to update user", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
    }
  };

  const closeEditUserModal = () => {
    setIsEditUserModalOpen(false);
    setUserToEdit(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRoleId("");
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
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
          >
            {isEditing ? "Update Role" : "Add Role"}
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
                  onClick={() => handleEdit(role)}
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

              {hasPermission("manage_permissions") && (
                <button
                  onClick={() => openPermissionModal(role.id)}
                  className="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600 transition duration-200"
                >
                  Manage Permissions
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Permission Assignment Modal */}
      <Modal
        isOpen={isPermissionModalOpen}
        onRequestClose={closePermissionModal}
        contentLabel="Manage Permissions"
        className="max-w-sm mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Manage Permissions for Role</h3>
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission.id)} // Correct ID comparison
              onChange={() => togglePermission(permission.id)}
              className="mr-2"
            />
            <span>{permission.permissionName}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-end">
          <button
            onClick={closePermissionModal}
            className="mr-2 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={assignPermissionsToRole}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
          >
            Save Permissions
          </button>
        </div>
      </Modal>

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
            <div>
              {/* <button
                onClick={() => openEditUserModal(user)}
                className="bg-yellow-500 text-white rounded px-2 py-1 mr-2 hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button> */}

              {hasPermission("delete_user") && (
                <button
                  onClick={() => openDeleteUserModal(user)}
                  className="bg-red-500 text-white rounded px-2 py-1 mr-2 hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onRequestClose={closeAddUserModal}
        contentLabel="Add User"
        className="max-w-md mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleAddUser}>
          <label className="block text-gray-700">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <label className="block text-gray-700 mt-3">
            Role:
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-gray-700 mt-3 relative">
            Password:
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
            <button
              type="button"
              className="absolute right-2 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </label>
          <label className="block text-gray-700 mt-3">
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full flex items-center justify-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" /> // Loading spinner icon
            ) : (
              "Add User"
            )}{" "}
          </button>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteUserModalOpen}
        onRequestClose={closeDeleteUserModal}
        contentLabel="Delete User"
        className="max-w-sm mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Confirm User Deletion</h3>
        <p>Are you sure you want to delete the user "{userToDelete?.email}"?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeDeleteUserModal}
            className="mr-2 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteUser(userToDelete?.id)}
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Role"
        className="max-w-sm mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p>
          Are you sure you want to delete the role "{roleToDelete?.roleName}"?
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeDeleteModal}
            className="mr-2 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteRole(roleToDelete.id)}
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditUserModalOpen}
        onRequestClose={closeEditUserModal}
        contentLabel="Edit User"
        className="max-w-md mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Edit User</h3>
        <form onSubmit={handleUpdateUser}>
          <label className="block text-gray-700">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <label className="block text-gray-700 mt-3">
            Role:
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-gray-700 mt-3">
            New Password (optional):
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <label className="block text-gray-700 mt-3">
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-pink-500 text-white rounded px-4 py-2 hover:bg-pink-600 transition duration-200"
          >
            Update User
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Role"
        className="max-w-sm mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p>
          Are you sure you want to delete the role "{roleToDelete?.roleName}"?
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeDeleteModal}
            className="mr-2 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteRole(roleToDelete.id)}
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>

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
