import React, { useState, useEffect } from 'react';

const RoomForm = ({ room, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    number: '',
    category: 'SIMPLES', // Default category
    basePrice: '',
    status: 'AVAILABLE', // Default status
  });

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number,
        category: room.category,
        basePrice: room.basePrice,
        status: room.status,
      });
    } else {
      setFormData({
        number: '',
        category: 'SIMPLES',
        basePrice: '',
        status: 'AVAILABLE',
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">Room Number</label>
        <input
          type="text"
          id="number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="SIMPLES">SIMPLES</option>
          <option value="DUPLO">DUPLO</option>
          <option value="SUITE">SUITE</option>
        </select>
      </div>
      <div>
        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price</label>
        <input
          type="number"
          id="basePrice"
          name="basePrice"
          value={formData.basePrice}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="OCCUPIED">OCCUPIED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {room ? 'Update Room' : 'Add Room'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default RoomForm;
