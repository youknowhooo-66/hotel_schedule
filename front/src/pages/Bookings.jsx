import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { 
  Calendar, Search, Filter, Edit2, Trash2, 
  ChevronLeft, ArrowUpDown, CalendarDays, User, Briefcase, Clock, List, Calendar as CalendarIcon
} from "lucide-react";
import BookingCalendar from "../components/BookingCalendar";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]); // To keep original data for filtering/sorting
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [filter, setFilter] = useState({
    roomId: "",
    serviceType: "",
    startDate: "",
    endDate: ""
  });
  const navigate = useNavigate();

  async function carregarDados() {
    try {
      const [resBookings, resRooms] = await Promise.all([
        api.get("/booking"),
        api.get("/room")
      ]);
      setBookings(resBookings.data);
      setOriginalBookings(resBookings.data);
      setRooms(resRooms.data);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // --- Sorting Logic ---
  const sortBookings = (arr) => {
    return [...arr].sort((a, b) => {
      // Primary sort: Alphabetical by Client Name or Professional Name
      // Fallback to 'name' if 'clientName' is not available, or use cleaner name if available
      const nameA = (a.guestName || a.room?.name || "").toLowerCase();
      const nameB = (b.guestName || b.room?.name || "").toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // Secondary sort: Chronological by check-in date
      const dateA = new Date(a.checkIn);
      const dateB = new Date(b.checkIn);
      return dateA - dateB;
    });
  };

  // --- Filtering and Searching Logic ---
  useEffect(() => {
    let filtered = [...originalBookings];

    // Search term filtering
    if (searchTerm) {
      filtered = filtered.filter(b =>
        (b.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (b.room?.number?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (b.room?.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    // Filter by room
    if (filter.roomId) {
      filtered = filtered.filter(b => String(b.roomId) === filter.roomId);
    }

    // Filter by status
    if (filter.status) {
      filtered = filtered.filter(b => b.status === filter.status);
    }

    // Filter by date range (baseado na data de Check-in)
    if (filter.startDate) {
      const start = new Date(filter.startDate + "T00:00:00");
      filtered = filtered.filter(b => new Date(b.checkIn) >= start);
    }
    if (filter.endDate) {
      const end = new Date(filter.endDate + "T23:59:59");
      filtered = filtered.filter(b => new Date(b.checkIn) <= end);
    }

    setBookings(sortBookings(filtered));
  }, [searchTerm, filter, originalBookings]);

  // --- Handlers for Status Update and Deletion ---
  async function deletar(id) {
    if (window.confirm("Deseja realmente excluir esta reserva?")) {
      try {
        await api.delete(`/booking/${id}`);
        toast.success("Reserva excluída!");
        carregarDados(); // Reload all data
      } catch (error) {
        toast.error("Erro ao excluir reserva");
      }
    }
  }

  async function atualizarStatus(id, status) {
    try {
      await api.patch(`/booking/${id}/status`, { status });
      toast.success("Status atualizado!");
      carregarDados(); // Reload all data
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  }

  // --- Handlers for filters ---
  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-500 pb-20 pt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Reservas</h1>
            <p className="text-gray-500 mt-1">Monitore e gerencie todos os agendamentos do hotel.</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendário
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por Hóspede, Quarto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 transition-colors bg-gray-50/50"
            />
          </div>
          
          <div className="md:col-span-3 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="roomId"
              value={filter.roomId}
              onChange={handleFilterChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 transition-colors appearance-none bg-gray-50/50"
            >
              <option value="">Todos Quartos</option>
              {rooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {`Quarto ${c.number} (${c.category})`}
                </option>
              ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </div>

          <div className="md:col-span-4 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="status"
              value={filter.status || ""}
              onChange={handleFilterChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 transition-colors appearance-none bg-gray-50/50"
            >
              <option value="">Todos Status</option>
              <option value="PENDING">Pendente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="CHECKED_IN">Check-in Realizado</option>
              <option value="CHECKED_OUT">Check-out Realizado</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">Período:</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-lg py-2 transition-colors bg-gray-50/50"
            />
            <span className="text-gray-400 text-sm font-medium">até</span>
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-lg py-2 transition-colors bg-gray-50/50"
            />
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hóspede</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estadia (In/Out)</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quarto</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                          {b.guestName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{b.guestName}</div>
                          <div className="text-xs text-gray-500">{b.guestEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs font-bold text-gray-900">
                          <div className="w-4 h-4 rounded bg-green-50 flex items-center justify-center mr-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          </div>
                          {new Date(b.checkIn).toLocaleDateString()}
                          <span className="text-[10px] text-gray-400 ml-2 font-normal">
                            {new Date(b.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex items-center text-xs font-bold text-gray-900">
                          <div className="w-4 h-4 rounded bg-red-50 flex items-center justify-center mr-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          {new Date(b.checkOut).toLocaleDateString()}
                          <span className="text-[10px] text-gray-400 ml-2 font-normal">
                            {new Date(b.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                        {b.room ? `Quarto ${b.room.number}` : "Não atribuído"}
                      </span>
                      {b.room && <div className="text-[10px] text-gray-400 mt-1 ml-1">{b.room.category}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {b.totalPrice ? `R$ ${Number(b.totalPrice).toFixed(2)}` : b.room?.basePrice ? `R$ ${Number(b.room.basePrice).toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={b.status}
                        onChange={(e) => atualizarStatus(b.id, e.target.value)}
                        className={`
                          text-[10px] font-bold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-2
                          ${b.status === "CONFIRMED" ? "bg-green-100 text-green-800 focus:ring-green-500" :
                            b.status === "CANCELLED" ? "bg-red-100 text-red-800 focus:ring-red-500" :
                            b.status === "COMPLETED" || b.status === "CHECKED_OUT" ? "bg-blue-100 text-blue-800 focus:ring-blue-500" :
                            "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                          }
                        `}
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="CHECKED_IN">Check-in</option>
                        <option value="CHECKED_OUT">Check-out</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/bookings/edit/${b.id}`)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletar(b.id)}
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
            {bookings.length === 0 && (
              <div className="text-center py-12 text-gray-500 italic">
                Nenhum agendamento encontrado para os filtros selecionados.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
           <BookingCalendar 
            bookings={bookings} 
            onEventClick={(booking) => navigate(`/bookings/edit/${booking.id}`)} 
          />
        </div>
      )}
    </div>
  );
}
