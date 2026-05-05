import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { 
  Calendar, Search, Filter, Edit2, Trash2, 
  ChevronLeft, ArrowUpDown, CalendarDays, User, Briefcase, Clock
} from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]); // To keep original data for filtering/sorting
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        (b.room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    // Filter by room
    if (filter.roomId) {
      filtered = filtered.filter(b => String(b.roomId) === filter.roomId);
    }

    // Filter by date range (check-in/check-out)
    if (filter.startDate) {
      const start = new Date(filter.startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(b => new Date(b.checkIn) >= start);
    }
    if (filter.endDate) {
      const end = new Date(filter.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(b => new Date(b.checkOut) <= end);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            Gestão de Reservas
          </h1>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
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
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 transition-colors"
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
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 transition-colors appearance-none bg-white"
            >
              <option value="">Todos Quartos</option>
              {rooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </div>

          <div className="md:col-span-4 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="serviceType"
              value={filter.serviceType}
              onChange={handleFilterChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 transition-colors appearance-none bg-white"
            >
              <option value="">Todos Tipos de Serviço</option>
              <option value="residential">Residencial</option>
              <option value="commercial">Comercial</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2 transition-colors"
            />
            <span className="text-gray-500 text-sm">até</span>
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hóspede</th>
                <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quarto</th>
                <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
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
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {b.guestName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{b.guestName}</div>
                        <div className="text-sm text-gray-500">{b.guestEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {new Date(b.checkIn).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-0.5">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(b.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {b.room?.name || "Não atribuído"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {b.room?.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {b.totalPrice ? `R$ ${Number(b.totalPrice).toFixed(2)}` : b.room?.basePrice ? `R$ ${Number(b.room.basePrice).toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={b.status}
                      onChange={(e) => atualizarStatus(b.id, e.target.value)}
                      className={`
                        text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-2
                        ${b.status === "CONFIRMED" ? "bg-green-100 text-green-800 focus:ring-green-500" :
                          b.status === "CANCELLED" ? "bg-red-100 text-red-800 focus:ring-red-500" :
                          b.status === "COMPLETED" ? "bg-blue-100 text-blue-800 focus:ring-blue-500" :
                          "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                        }
                      `}
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="COMPLETED">Concluído</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma reserva</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não encontramos nenhum agendamento com os filtros atuais.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
