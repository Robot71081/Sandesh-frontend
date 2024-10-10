import React from 'react'



const ConfirmDeleteDialog = ({ isOpen, isClose, deleteHandler}) => {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Confirm Delete</h2>
        <button onClick={isClose} className="text-gray-600 hover:text-gray-900">
          &times; 
        </button>
      </div>
      <div className="mb-4">
        <p>Are you sure you want to delete this group?</p>
      </div>
      <div className="flex justify-end space-x-4">
        <button 
          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition"
          onClick={isClose}
        >
          No
        </button>
        <button 
          className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition"
           onClick={deleteHandler}
        >
          Yes
        </button>
      </div>
    </div>
  </div>
  
  );
};




export default ConfirmDeleteDialog
