import { FaSpinner } from "react-icons/fa";
import Modal from "react-modal";

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  footerButtons = [],
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="max-w-md mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div>{children}</div>
      <div className="mt-4 flex justify-end">
        {footerButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`mr-2 ${button.className}`}
            disabled={loading} // Disable button when loading
          >
            {loading && button.isLoading ? (
              <FaSpinner className="animate-spin mr-2" /> // Add spinner if loading
            ) : (
              button.label
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default CustomModal;
