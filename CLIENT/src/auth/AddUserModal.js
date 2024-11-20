import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Modal from "react-modal"; // Ensure you have this installed
import { RegisterUser } from "../FirebaseFunctions/RegisterUser";

const AddUserModal = ({
  isAddUserModalOpen,
  closeAddUserModal,
  roles,
  fetchUsers,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const result = await RegisterUser(email, password, roleId);

      toast.success(result.message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
      });

      fetchUsers(); // Refresh users
      closeAddUserModal(); // Close modal
    } catch (error) {
      toast.error(error.message || "Failed to add user", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
            aria-label="Email"
          />
        </label>
        <label className="block text-gray-700 mt-3">
          Role:
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
            className="border border-gray-300 rounded p-2 mt-1 w-full"
            aria-label="Role"
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
            aria-label="Password"
          />
          <button
            type="button"
            className="absolute right-2 top-3 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle Password Visibility"
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
            aria-label="Confirm Password"
          />
        </label>
        <button
          type="submit"
          className="mt-4 w-full flex items-center justify-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : "Add User"}
        </button>
      </form>
    </Modal>
  );
};

export default AddUserModal;
