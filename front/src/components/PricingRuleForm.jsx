import React, { useState, useEffect } from 'react';

const PricingRuleForm = ({ rule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    startDate: '',
    endDate: '',
    priceMultiplier: 1.0,
    fixedPrice: '',
    category: '', // Can be null, or specific room category
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        description: rule.description,
        startDate: rule.startDate ? new Date(rule.startDate).toISOString().split('T')[0] : '',
        endDate: rule.endDate ? new Date(rule.endDate).toISOString().split('T')[0] : '',
        priceMultiplier: rule.priceMultiplier || 1.0,
        fixedPrice: rule.fixedPrice || '',
        category: rule.category || '',
      });
    } else {
      setFormData({
        description: '',
        startDate: '',
        endDate: '',
        priceMultiplier: 1.0,
        fixedPrice: '',
        category: '',
      });
    }
  }, [rule]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      priceMultiplier: parseFloat(formData.priceMultiplier),
      fixedPrice: formData.fixedPrice ? parseFloat(formData.fixedPrice) : null,
      category: formData.category || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="priceMultiplier" className="block text-sm font-medium text-gray-700">Price Multiplier</label>
        <input
          type="number"
          id="priceMultiplier"
          name="priceMultiplier"
          value={formData.priceMultiplier}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="fixedPrice" className="block text-sm font-medium text-gray-700">Fixed Price (Optional)</label>
        <input
          type="number"
          id="fixedPrice"
          name="fixedPrice"
          value={formData.fixedPrice}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Room Category (Optional)</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">All Categories</option>
          <option value="SIMPLES">SIMPLES</option>
          <option value="DUPLO">DUPLO</option>
          <option value="SUITE">SUITE</option>
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {rule ? 'Update Rule' : 'Add Rule'}
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

export default PricingRuleForm;
