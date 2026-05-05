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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CalendarPlus className="w-6 h-6 text-blue-600" />
            </div>
            Nova Reserva
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Preencha os dados abaixo para criar uma nova reserva no sistema.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10">
          <BookingForm onSubmit={handleSubmit} rooms={rooms} />
        </div>
      </div>
    </div>
  );
}