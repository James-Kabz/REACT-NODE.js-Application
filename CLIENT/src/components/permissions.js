import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

// Modal component for adding/updating permissions
const PermissionModal = ({ isOpen, onClose, onSave, permission }) => {
  const [permissionName, setPermissionName] = useState("");

  useEffect(() => {
    if (permission) {
      setPermissionName(permission.permissionName); // Set the permission name for editing
    } else {
      setPermissionName(""); // Reset for adding new permission
    }
  }, [permission]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(permission ? permission.id : null, permissionName);
    onClose(); // Close modal after saving
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center`}
    >
      <div className="bg-white rounded-lg p-6 w-80">
        <h3 className="text-lg font-semibold mb-4">
          {permission ? "Edit Permission" : "Add Permission"}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={permissionName}
            onChange={(e) => setPermissionName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Permission Name"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
          >
            {permission ? "Update" : "Add"}
          </button>
        </form>
        <button onClick={onClose} className="mt-2 text-red-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

const PermissionsPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  // Fetch permissions from the API
  const fetchPermissions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/permissions");
      setPermissions(response.data);
    } catch (error) {
      toast.error("Failed to fetch permissions");
    }
  };

  // Add a new permission
  const addPermission = async (permissionName) => {
    try {
      await axios.post("http://localhost:4000/api/permissions", {
        name: permissionName,
      });
      toast.success("Permission added successfully!");
      fetchPermissions(); // Refresh the list
    } catch (error) {
      toast.error("Failed to add permission");
    }
  };

  // Update an existing permission
  const updatePermission = async (id, permissionName) => {
    try {
      await axios.put(`http://localhost:4000/api/permissions/${id}`, {
        permissionName: permissionName,
      });
      toast.success("Permission updated successfully!");
      fetchPermissions(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update permission");
    }
  };

  // Delete a permission
  const deletePermission = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/permissions/${id}`);
      toast.success("Permission deleted successfully!");
      fetchPermissions(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete permission");
    }
  };

  useEffect(() => {
    fetchPermissions(); // Fetch permissions on component mount
  }, []);

  return (
    <div className="p-8 mt-32">
      <h2 className="text-2xl font-semibold mb-4">Permissions</h2>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingPermission(null);
        }}
        className="mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Add Permission
      </button>
      <ul>
        {permissions.map((permission) => (
          <li
            key={permission.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{permission.permissionName}</span>
            <div>
              <button
                onClick={() => {
                  setModalOpen(true);
                  setEditingPermission(permission);
                }}
                className="text-blue-600 hover:underline mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deletePermission(permission.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <PermissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={editingPermission ? updatePermission : addPermission}
        permission={editingPermission}
      />

      <ToastContainer />
    </div>
  );
};

export default PermissionsPage;
