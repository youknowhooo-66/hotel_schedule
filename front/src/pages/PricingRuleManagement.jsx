import React, { useEffect, useState } from 'react';
import { getPricingRules, createPricingRule, updatePricingRule, deletePricingRule } from '../services/api';
import PricingRuleForm from '../components/PricingRuleForm';
import { toast } from 'react-toastify';
import { DollarSign, Tag, Calendar, Edit2, Trash2 } from "lucide-react";

const PricingRuleManagement = ({ standalone = true }) => {
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
      toast.error("Erro ao carregar regras de preço");
      console.error('Erro ao buscar regras de preço:', error);
    }
  };

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        await updatePricingRule(editingRule.id, ruleData);
        toast.success("Regra de preço atualizada!");
      } else {
        await createPricingRule(ruleData);
        toast.success("Regra de preço criada!");
      }
      setEditingRule(null);
      fetchPricingRules();
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar regra de preço";
      toast.error(msg);
      console.error('Erro ao salvar regra de preço:', error);
    }
  };

  const handleDeleteRule = async (id) => {
    if (window.confirm("Deseja realmente excluir esta regra de preço?")) {
      try {
        await deletePricingRule(id);
        toast.success("Regra excluída!");
        fetchPricingRules();
      } catch (error) {
        toast.error("Erro ao excluir regra");
        console.error('Erro ao excluir regra de preço:', error);
      }
    }
  };

  const content = (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Tarifas</h1>
            <p className="text-gray-500 mt-1">Configure multiplicadores e preços para datas específicas.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary-500" />
          {editingRule ? 'Editar Regra' : 'Nova Regra de Preço'}
        </h2>
        <PricingRuleForm rule={editingRule} onSave={handleSaveRule} onCancel={() => setEditingRule(null)} />
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-bold text-gray-800">Regras Existentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ajuste</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pricingRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{rule.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      {new Date(rule.startDate).toLocaleDateString()}
                      <span className="text-gray-400">→</span>
                      {new Date(rule.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rule.fixedPrice ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs">
                        R$ {Number(rule.fixedPrice).toFixed(2)}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                        {rule.priceMultiplier}x Multiplicador
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium text-xs">
                      {rule.category || 'Todas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pricingRules.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">
              Nenhuma regra de preço configurada.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!standalone) return content;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {content}
    </div>
  );
};

export default PricingRuleManagement;

