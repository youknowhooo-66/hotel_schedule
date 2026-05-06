import { useEffect, useState } from "react";
import PricingRuleManagement from './PricingRuleManagement';
import AuditLogPage from './AuditLogPage';
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import api from "../services/api";
import { CalendarDays, Users, Activity, Plus, Sparkles, DollarSign, Gavel } from "lucide-react";
import Admin from "./Admin";

export default function Dashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    bookings: 0,
    rooms: 0,
    revenue: 0,
  });
  const [activeAdminSection, setActiveAdminSection] = useState(null);
  const isAdmin = user && (user.usuario?.tipoUsuario === "ADMIN" || user.tipoUsuario === "ADMIN");

  async function carregarStats() {
    try {
      const [resBookings, resRooms] = await Promise.all([
        api.get("/booking"),
        api.get("/room")
      ]);
      const revenue = resBookings.data.reduce((sum, b) => sum + (Number(b.totalPrice) || Number(b.room?.basePrice) || 0), 0);
      setStats({
        bookings: resBookings.data.length,
        rooms: resRooms.data.length,
        revenue,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas", error);
    }
  }

  useEffect(() => {
    carregarStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <span className="text-sm font-bold tracking-wider text-primary-400 uppercase">Visão Geral</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Que bom ver você, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">{user?.usuario?.nome?.split(' ')[0] || user?.nome?.split(' ')[0] || "Equipe"}</span> 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            Aqui está o que está acontecendo com os seus agendamentos hoje.
          </p>
        </div>
        <div className="mt-6 sm:mt-0 relative z-10">
          <button
            onClick={() => navigate('/bookings/new')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg shadow-blue-500/20 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Reserva
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Reservas", value: stats.bookings, icon: CalendarDays, color: "text-red-600", bg: "bg-red-50" },
          { title: "Quartos", value: stats.rooms, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Receita", value: `R$ ${Number(stats.revenue).toFixed(2)}`, icon: Activity, color: "text-green-600", bg: "bg-green-50" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-semibold text-sm uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-4xl font-black mt-2 tracking-tighter text-gray-900">{stat.value}</h3>
              </div>
              <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
        
        {isAdmin && (
          <>
            <div onClick={() => setActiveAdminSection(activeAdminSection === 'pricing' ? null : 'pricing')} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Regras de Preço</p>
                  <h3 className="text-2xl font-bold mt-2 text-gray-900">Gerenciar regras</h3>
                </div>
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </div>
            <div onClick={() => setActiveAdminSection(activeAdminSection === 'audit' ? null : 'audit')} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Auditoria</p>
                  <h3 className="text-2xl font-bold mt-2 text-gray-900">Ver histórico</h3>
                </div>
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <Gavel className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isAdmin && activeAdminSection === 'pricing' && <PricingRuleManagement />}
      {isAdmin && activeAdminSection === 'audit' && <AuditLogPage />}
      <Admin />
    </div>
  );
}
