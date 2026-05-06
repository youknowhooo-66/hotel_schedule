import { useState, useEffect } from "react";
import { User, Mail, Calendar, Clock, Briefcase, AlignLeft, Users } from "lucide-react";

export default function BookingForm({ onSubmit, bookingSelecionado, rooms }) {
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    checkIn: "",
    checkOut: "",
    notes: "",
    roomId: "",
  });
  const [errors, setErrors] = useState({});
  const selectedRoom = rooms.find(r => r.id === form.roomId);

  useEffect(() => {
    if (bookingSelecionado) {
      const startDate = new Date(bookingSelecionado.checkIn);
      const endDate = new Date(bookingSelecionado.checkOut);
      const tzoffset = startDate.getTimezoneOffset() * 60000;
      const localStart = (new Date(startDate - tzoffset)).toISOString().slice(0, 16);
      const localEnd = (new Date(endDate - tzoffset)).toISOString().slice(0, 16);

      setForm({
        guestName: bookingSelecionado.guestName || "",
        guestEmail: bookingSelecionado.guestEmail || "",
        checkIn: localStart,
        checkOut: localEnd,
        notes: bookingSelecionado.notes || "",
        roomId: bookingSelecionado.roomId || "",
      });
    } else {
      setForm({
        guestName: "",
        guestEmail: "",
        checkIn: "",
        checkOut: "",
        notes: "",
        roomId: "",
      });
    }
  }, [bookingSelecionado]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // Clear error on change
  }

  function validateForm() {
    const newErrors = {};
    if (!form.guestName) newErrors.guestName = "Nome do Hóspede é obrigatório.";
    if (!form.guestEmail) newErrors.guestEmail = "Email do Hóspede é obrigatório.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.guestEmail)) {
      newErrors.guestEmail = "Email inválido.";
    }
    if (!form.checkIn) newErrors.checkIn = "Data/Hora de check-in é obrigatória.";
    if (!form.checkOut) newErrors.checkOut = "Data/Hora de check-out é obrigatória.";
    else if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      newErrors.checkOut = "Check-out deve ser posterior ao check-in.";
    }
    if (!form.roomId) newErrors.roomId = "Quarto é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      


      {/* Client Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Hóspede</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="guestName"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors ${errors.guestName ? 'border-red-300 ring-red-300' : ''}`}
              placeholder="Ex: João da Silva"
              value={form.guestName}
              onChange={handleChange}
            />
          </div>
          {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email do Hóspede</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="guestEmail"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors ${errors.guestEmail ? 'border-red-300 ring-red-300' : ''}`}
              placeholder="joao@exemplo.com"
              value={form.guestEmail}
              onChange={handleChange}
            />
          </div>
          {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail}</p>}
        </div>
      </div>

      {/* Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              name="checkIn"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors ${errors.checkIn ? 'border-red-300 ring-red-300' : ''}`}
              value={form.checkIn}
              onChange={handleChange}
            />
          </div>
          {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              name="checkOut"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors ${errors.checkOut ? 'border-red-300 ring-red-300' : ''}`}
              value={form.checkOut}
              onChange={handleChange}
            />
          </div>
          {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quarto</label>
          <div className="relative rounded-md shadow-sm">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="roomId"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors appearance-none bg-white text-gray-900 ${errors.roomId ? 'border-red-300 ring-red-300' : ''}`}
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              value={form.roomId}
              onChange={handleChange}
            >
              <option value="" disabled className="text-gray-400">Selecione um quarto...</option>
              {rooms.map((c) => (
                <option key={c.id} value={c.id} className="text-gray-900">
                  {`Quarto ${c.number} (${c.category})`}
                </option>
              ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          {selectedRoom && (
            <p className="text-sm text-gray-800 mt-2">Preço por noite: <span className="font-semibold">R$ {Number(selectedRoom.basePrice).toFixed(2)}</span></p>
          )}
          {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas ou Observações Adicionais (Opcional)</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute top-3 left-3 pointer-events-none">
            <AlignLeft className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            name="notes"
            rows={3}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors"
            placeholder="Observações da reserva (ex.: instruções de check-in)"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {bookingSelecionado ? "Salvar Alterações da Reserva" : "Confirmar Nova Reserva"}
        </button>
      </div>
    </form>
  );
}
