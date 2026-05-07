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

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = "A descrição é obrigatória.";
    if (!formData.startDate) newErrors.startDate = "A data de início é obrigatória.";
    if (!formData.endDate) newErrors.endDate = "A data de fim é obrigatória.";
    else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "A data de fim deve ser posterior à data de início.";
    }
    
    if (formData.priceMultiplier <= 0) {
      newErrors.priceMultiplier = "O multiplicador deve ser maior que zero.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Limpa erro ao digitar
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        priceMultiplier: parseFloat(formData.priceMultiplier),
        fixedPrice: formData.fixedPrice ? parseFloat(formData.fixedPrice) : null,
        category: formData.category || null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
          placeholder="Ex: Alta Temporada, Feriado..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
          />
          {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Fim</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
          />
          {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priceMultiplier" className="block text-sm font-medium text-gray-700">Multiplicador de Preço</label>
          <input
            type="number"
            id="priceMultiplier"
            name="priceMultiplier"
            value={formData.priceMultiplier}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.priceMultiplier ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            step="0.01"
            placeholder="Ex: 1.5"
          />
          {errors.priceMultiplier && <p className="text-red-500 text-xs mt-1">{errors.priceMultiplier}</p>}
          <p className="text-xs text-gray-500 mt-1">Multiplica o preço base (1.5 = +50%)</p>
        </div>
        <div>
          <label htmlFor="fixedPrice" className="block text-sm font-medium text-gray-700">Preço Fixo (Opcional)</label>
          <input
            type="number"
            id="fixedPrice"
            name="fixedPrice"
            value={formData.fixedPrice}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.fixedPrice ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            step="0.01"
            placeholder="Ex: 250.00"
          />
          {errors.fixedPrice && <p className="text-red-500 text-xs mt-1">{errors.fixedPrice}</p>}
          <p className="text-xs text-gray-500 mt-1">Se definido, ignora o multiplicador</p>
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria de Quarto (Opcional)</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">Todas as categorias</option>
          <option value="SIMPLES">SIMPLES</option>
          <option value="DUPLO">DUPLO</option>
          <option value="SUITE">SUITE</option>
        </select>
      </div>
      <div className="flex space-x-4 pt-2">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          {rule ? 'Atualizar Regra' : 'Adicionar Regra'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default PricingRuleForm;

