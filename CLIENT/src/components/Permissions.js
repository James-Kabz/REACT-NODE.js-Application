import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

// Modal component for adding/updating permissions
const PermissionModal = ({ isOpen, onClose, onSave, permission }) => {
  const [permissionName, setPermissionName] = useState("");
  
  useEffect(() => {
    if (permission) {
      setPermissionName(permission.permissionName); // Set the permission name for editing
    } else if (isOpen) {
      setPermissionName(""); // Reset for adding new permission
    }
  }, [permission, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!permissionName) {
      toast.error("Permission Name cannot be empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      return;
    }

    if (permission) {
      onSave(permission.id, permissionName);
    } else {
      onSave(permissionName);
    }

    onClose(); // Close the modal
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center z-50`}
    >
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg transform transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {permission ? "Edit Permission" : "Add Permission"}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={permissionName}
            onChange={(e) => setPermissionName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Permission Name"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full transition-colors duration-200"
          >
            {permission ? "Update" : "Add"}
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-red-500 hover:underline">
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
  const { hasPermission } = useAuth();

  const fetchPermissions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/permissions");
      setPermissions(response.data);
    } catch (error) {
      toast.error("Failed to fetch permissions", { position: "top-center" });
    }
  };

  const addPermission = async (permissionName) => {
    try {
      await axios.post("http://localhost:4000/api/permissions", {
        permissionName,
      });
      toast.success("Permission added successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      fetchPermissions();
    } catch (error) {
      toast.error("Failed to add permission", {
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

  const updatePermission = async (id, permissionName) => {
    try {
      await axios.put(`http://localhost:4000/api/permissions/${id}`, {
        permissionName,
      });
      toast.success("Permission updated successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      fetchPermissions();
    } catch (error) {
      toast.error("Failed to update permission", {
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

  const deletePermission = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/permissions/${id}`);
      toast.success("Permission deleted successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        draggable: true,
        newestOnTop: true,
      });
      fetchPermissions();
    } catch (error) {
      toast.error("Failed to delete permission", {
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

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="max-w-7xl max-h-5xl mx-auto mt-10 p-6 border border-gray-200 rounded-lg shadow-md bg-white space-y-4">
      <h2 className="text-3xl font-semibold text-gray-800">Permissions</h2>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingPermission(null);
        }}
        className="mb-6 bg-blue-600 text-white py-2 px-5 rounded hover:bg-blue-700 transition-all duration-200"
      >
        Add Permission
      </button>
      <ul className="divide-y divide-gray-200">
        {permissions.map((permission) => (
          <li
            key={permission.id}
            className="flex justify-between items-center py-4 px-2 hover:bg-gray-100 rounded transition-all"
          >
            <span className="text-gray-700">{permission.permissionName}</span>
            <div className="flex space-x-3">
              {hasPermission("edit_permission") && (
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setEditingPermission(permission);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
              {hasPermission("delete_permission") && (
                <button
                  onClick={() => deletePermission(permission.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
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

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
};

export default PermissionsPage;
