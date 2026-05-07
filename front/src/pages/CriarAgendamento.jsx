import { useState, useEffect } from "react";
import api  from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { ArrowLeft, CalendarPlus } from "lucide-react";

export default function CriarAgendamento() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await api.get("/room");
        setRooms(res.data);
      } catch (err) {
        toast.error("Erro ao carregar quartos");
      }
    }
    fetchRooms();
  }, []);

  async function handleSubmit(formData) {
    try {
      const payload = {
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        roomId: formData.roomId,
      };
      await api.post("/booking", payload);
      toast.success("Reserva realizada com sucesso!");
      navigate("/bookings");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Erro ao criar reserva";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-500 pb-20 pt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
            <CalendarPlus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Reserva</h1>
            <p className="text-gray-500 mt-1">Cadastre um novo agendamento no sistema.</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/bookings")}
          className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ver Reservas
        </button>
      </div>

      <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50"></div>
        <div className="relative z-10">
          <BookingForm onSubmit={handleSubmit} rooms={rooms} />
        </div>
      </div>
    </div>
  );
}