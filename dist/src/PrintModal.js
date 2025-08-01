 import React from 'react';

    // PrintModal component displays a modal for selecting print options.
    const PrintModal = ({ show, onClose, onPrint }) => {
      if (!show) return null; // Don't render if 'show' is false

      return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-auto transform scale-100 animate-fade-in">
            <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">Select Print Range</h4>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => onPrint('thisMonth')} // Calls onPrint with 'thisMonth'
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Print Current Month Logs
              </button>
              <button
                onClick={() => onPrint('lastMonth')} // Calls onPrint with 'lastMonth'
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Print Last Month Logs
              </button>
              <button
                onClick={onClose} // Calls onClose to close the modal
                className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default PrintModal;
    