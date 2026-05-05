import React, { useEffect, useState } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../services/api';
import RoomForm from '../components/RoomForm';

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
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSaveRoom = async (roomData) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomData);
      } else {
        await createRoom(roomData);
      }
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary-700 mb-6">Room Management</h1>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
        <RoomForm room={editingRoom} onSave={handleSaveRoom} onCancel={() => setEditingRoom(null)} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Rooms</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Number</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Base Price</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">{room.number}</td>
                <td className="py-2 px-4 border-b border-gray-200">{room.category}</td>
                <td className="py-2 px-4 border-b border-gray-200">{room.basePrice}</td>
                <td className="py-2 px-4 border-b border-gray-200">{room.status}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => setEditingRoom(room)}
                    className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
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

export default RoomManagement;
