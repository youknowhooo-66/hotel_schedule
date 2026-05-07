import React, { useEffect, useState } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../services/api';
import RoomForm from '../components/RoomForm';
import { toast } from 'react-toastify';
import { DoorOpen, Plus, Home, Edit2, Trash2 } from "lucide-react";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      toast.error("Erro ao carregar lista de quartos");
      console.error('Erro ao buscar quartos:', error);
    }
  };

  const handleSaveRoom = async (roomData) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomData);
        toast.success("Quarto atualizado!");
      } else {
        await createRoom(roomData);
        toast.success("Quarto criado!");
      }
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar quarto";
      toast.error(msg);
      console.error('Erro ao salvar quarto:', error);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Deseja realmente excluir este quarto?")) {
      try {
        await deleteRoom(id);
        toast.success("Quarto excluído!");
        fetchRooms();
      } catch (error) {
        toast.error("Erro ao excluir quarto");
        console.error('Erro ao excluir quarto:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-500 pb-20 pt-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
            <DoorOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Quartos</h1>
            <p className="text-gray-500 mt-1">Gerencie a disponibilidade e categorias dos quartos.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary-500" />
          {editingRoom ? 'Editar Quarto' : 'Adicionar Novo Quarto'}
        </h2>
        <RoomForm room={editingRoom} onSave={handleSaveRoom} onCancel={() => setEditingRoom(null)} />
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <Home className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-bold text-gray-800">Quartos Existentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço Base</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{room.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-xs">
                      {room.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {Number(room.basePrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                      room.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {room.status === 'AVAILABLE' ? 'DISPONÍVEL' : room.status === 'OCCUPIED' ? 'OCUPADO' : 'MANUTENÇÃO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingRoom(room)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
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
          {rooms.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">
              Nenhum quarto cadastrado ou erro ao carregar dados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;


