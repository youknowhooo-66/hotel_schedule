import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../services/api';

const AuditLogPage = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await getAuditLogs();
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary-700 mb-6">Audit Log</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity History</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Action</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Entity</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Entity ID</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b border-gray-200">{log.user?.nome || 'N/A'}</td>
                <td className="py-2 px-4 border-b border-gray-200">{log.action}</td>
                <td className="py-2 px-4 border-b border-gray-200">{log.entity}</td>
                <td className="py-2 px-4 border-b border-gray-200">{log.entityId}</td>
                <td className="py-2 px-4 border-b border-gray-200">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;
