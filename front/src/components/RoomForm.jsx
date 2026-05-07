import React, { useState, useEffect } from 'react';

const RoomForm = ({ room, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    number: '',
    category: 'SIMPLES', // Default category
    basePrice: '',
    status: 'AVAILABLE', // Default status
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.number) newErrors.number = "O número do quarto é obrigatório.";
    if (!formData.basePrice) newErrors.basePrice = "O preço base é obrigatório.";
    else if (formData.basePrice <= 0) newErrors.basePrice = "O preço deve ser maior que zero.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número do Quarto</label>
        <input
          type="text"
          id="number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.number ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
        />
        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
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
        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Preço Base</label>
        <input
          type="number"
          id="basePrice"
          name="basePrice"
          value={formData.basePrice}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.basePrice ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
          step="0.01"
        />
        {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
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
          <option value="AVAILABLE">DISPONÍVEL</option>
          <option value="OCCUPIED">OCUPADO</option>
          <option value="MAINTENANCE">MANUTENÇÃO</option>
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {room ? 'Atualizar Quarto' : 'Adicionar Quarto'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default RoomForm;

