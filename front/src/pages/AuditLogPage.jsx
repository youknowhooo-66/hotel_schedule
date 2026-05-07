import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../services/api';
import { Gavel, User, Activity, Clock, Database } from "lucide-react";
import { toast } from 'react-toastify';

const AuditLogPage = ({ standalone = true }) => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await getAuditLogs();
      setAuditLogs(response.data);
    } catch (error) {
      toast.error("Erro ao carregar logs de auditoria");
      console.error('Erro ao buscar logs de auditoria:', error);
    }
  };

  const content = (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
            <Gavel className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Log de Auditoria</h1>
            <p className="text-gray-500 mt-1">Rastreabilidade completa de todas as operações do sistema.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-gray-800">Histórico de Atividades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data / Hora</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ação</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entidade</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Detalhes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center mr-2">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      {log.user?.nome || 'Sistema'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      log.action.includes('CREATE') ? 'bg-green-100 text-green-700' :
                      log.action.includes('DELETE') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 text-gray-400" />
                      {log.entity} <span className="ml-1 text-gray-400 font-normal">#{log.entityId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate font-mono text-xs bg-gray-50 p-2 rounded border border-gray-100" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {auditLogs.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">
              Nenhum registro de auditoria encontrado.
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

export default AuditLogPage;
