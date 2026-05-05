import React, { useEffect, useState } from 'react';
import { getPricingRules, createPricingRule, updatePricingRule, deletePricingRule } from '../services/api';
import PricingRuleForm from '../components/PricingRuleForm';

const PricingRuleManagement = () => {
  const [pricingRules, setPricingRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);

  useEffect(() => {
    fetchPricingRules();
  }, []);

  const fetchPricingRules = async () => {
    try {
      const response = await getPricingRules();
      setPricingRules(response.data);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
    }
  };

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        await updatePricingRule(editingRule.id, ruleData);
      } else {
        await createPricingRule(ruleData);
      }
      setEditingRule(null);
      fetchPricingRules();
    } catch (error) {
      console.error('Error saving pricing rule:', error);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await deletePricingRule(id);
      fetchPricingRules();
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary-700 mb-6">Pricing Rule Management</h1>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</h2>
        <PricingRuleForm rule={editingRule} onSave={handleSaveRule} onCancel={() => setEditingRule(null)} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Pricing Rules</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Start Date</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">End Date</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Multiplier</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Fixed Price</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pricingRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">{rule.description}</td>
                <td className="py-2 px-4 border-b border-gray-200">{new Date(rule.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b border-gray-200">{new Date(rule.endDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b border-gray-200">{rule.priceMultiplier}</td>
                <td className="py-2 px-4 border-b border-gray-200">{rule.fixedPrice}</td>
                <td className="py-2 px-4 border-b border-gray-200">{rule.category || 'All'}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="bg-secondary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-secondary-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingRuleManagement;
