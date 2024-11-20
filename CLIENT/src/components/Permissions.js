import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";
import {
  addPermission,
  updatePermission,
  deletePermission,
  getPermissions,
} from "../FirebaseFunctions/PermissionFunction"; // Firebase functions
import CustomModal from "./CustomModal"; // Import CustomModal
import { showToast } from "./ToastMessage";

const PermissionsPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for modal actions
  const { hasPermission } = useAuth();

  const fetchPermissions = async () => {
    try {
      const permissionsData = await getPermissions();
      setPermissions(permissionsData);
    } catch (error) {
      showToast.error("Failed to fetch permissions");
    }
  };

  const addPermissionHandler = async (permissionName) => {
    setLoading(true);
    try {
      await addPermission(permissionName);
      showToast.success("Permission added successfully!");
      fetchPermissions();
      setModalOpen(false);
    } catch (error) {
      showToast.error("Failed to add permission");
    } finally {
      setLoading(false);
    }
  };

  const updatePermissionHandler = async (id, permissionName) => {
    setLoading(true);
    try {
      await updatePermission(id, permissionName);
      showToast.success("Permission updated successfully!");
      fetchPermissions();
      setModalOpen(false);
    } catch (error) {
      showToast.error("Failed to update permission");
    } finally {
      setLoading(false);
    }
  };

  const deletePermissionHandler = async (id) => {
    setLoading(true);
    try {
      await deletePermission(id);
      showToast.success("Permission deleted successfully!");
      fetchPermissions();
    } catch (error) {
      showToast.error("Failed to delete permission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="max-w-7xl max-h-5xl mx-auto mt-24 p-6 border border-gray-200 rounded-lg shadow-md bg-white space-y-4">
      <h2 className="text-3xl font-semibold text-gray-800">Permissions</h2>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingPermission(null); // Reset for new permission
        }}
        className="mb-6 bg-blue-600 text-white py-2 px-5 rounded hover:bg-blue-700 transition-all duration-200"
      >
        Add Permission
      </button>
      <ul className=" divide-y divide-gray-200">
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
                  onClick={() => deletePermissionHandler(permission.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <CustomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPermission ? "Edit Permission" : "Add Permission"}
        loading={loading}
        footerButtons={[
          {
            label: editingPermission ? "Update" : "Add",
            onClick: () => {
              const permissionName =
                document.getElementById("permission-name").value;
              if (editingPermission) {
                updatePermissionHandler(editingPermission.id, permissionName);
              } else {
                addPermissionHandler(permissionName);
              }
            },
            isLoading: loading,
            className:
              "bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700",
          },
          {
            label: "Cancel",
            onClick: () => setModalOpen(false),
            className:
              "bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400",
          },
        ]}
      >
        <input
          id="permission-name"
          type="text"
          defaultValue={
            editingPermission ? editingPermission.permissionName : ""
          }
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Permission Name"
        />
      </CustomModal>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
};

export default PermissionsPage;
