import React from "react";

interface MarkerModalProps {
  isVisible: boolean;
  modalPosition: { top: number; left: number };
  openModal: () => void;
}

const MarkerModal: React.FC<MarkerModalProps> = ({
  isVisible,
  modalPosition,
  openModal,
}) => {
  return (
    <div
      className={`flex flex-row justify-center gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg z-40 w-[90%] max-w-[280px] p-2 transition-opacity duration-300 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        top: `${modalPosition.top}px`,
        left: `${modalPosition.left}px`,
        transform: "translate(-80px, -20px)",
      }}
    >
      <h1 className="text-black self-center align-middle">
        Add a myth to this location?
      </h1>
      <button
        onClick={openModal}
        className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default MarkerModal;
