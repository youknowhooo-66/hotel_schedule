import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser } from "../utils/auth";
import { PlusCircle, Users, Briefcase, LogOut, LayoutDashboard, CalendarDays } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  
  const isAdmin = user && (user.usuario?.tipoUsuario === "ADMIN" || user.tipoUsuario === "ADMIN");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="pt-6 pb-2 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-full sticky top-6 z-50 transition-all">
        <div className="px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Logo />

            <div className="hidden lg:flex space-x-1">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Visão Geral
              </Link>
              <Link
                to="/bookings/new"
                className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive("/bookings/new")
                    ? "bg-secondary-50 text-secondary-600 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-secondary-600"
                }`}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Nova Reserva
              </Link>
              <Link
                to="/bookings"
                className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive("/bookings")
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                }`}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Minhas Reservas
              </Link>
              {isAdmin && (
                <>
                  {/* <Link
                    to="/admin"
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      isActive("/admin")
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Usuários
                  </Link> */}
                  <Link
                    to="/admin/rooms"
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      isActive("/admin/rooms")
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Gerenciar Quartos
                  </Link>
                  <Link
                    to="/admin/pricing-rules"
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      isActive("/admin/pricing-rules")
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Regras de Preço
                  </Link>
                  <Link
                    to="/admin/audit-log"
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      isActive("/admin/audit-log")
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Log de Auditoria
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              title="Sair do sistema"
            >
              <span className="hidden sm:block mr-2">Sair</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
