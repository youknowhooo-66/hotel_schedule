import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRooms, updateBooking, getBookings } from '../services/api';
import BookingForm from '../components/BookingForm';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from "react-toastify";

export default function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsResponse, roomsResponse] = await Promise.all([
          getBookings(),
          getRooms()
        ]);

        const foundBooking = bookingsResponse.data.find(b => b.id === parseInt(id));

        if (!foundBooking) {
          setError("Reserva não encontrada.");
          setLoading(false);
          return;
        }

        setBooking(foundBooking);
        setRooms(roomsResponse.data);
      } catch (err) {
        setError("Erro ao carregar dados: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleSubmit(formData) {
    try {
      const payload = {
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        roomId: formData.roomId,
      };
      await updateBooking(id, payload);
      toast.success("Reserva atualizada com sucesso!");
      navigate('/bookings');
    } catch (err) {
      toast.error("Erro ao atualizar reserva: " + (err.response?.data?.error || err.message));
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (error) return (
    <div className="max-w-3xl mx-auto p-4 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
        <p className="font-medium">{error}</p>
        <button onClick={() => navigate('/bookings')} className="mt-4 text-sm underline hover:text-red-800">Voltar para listagem</button>
      </div>
    </div>
  );
  if (!booking) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/bookings")}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
            Editar Reserva #{booking.id}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Atualize as informações da reserva de {booking.guestName}.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10">
          <BookingForm onSubmit={handleSubmit} bookingSelecionado={booking} rooms={rooms} />
          
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
             <button
              onClick={() => navigate('/bookings')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancelar Edição
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
