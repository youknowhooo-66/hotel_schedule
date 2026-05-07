import { Link } from "react-router-dom";
import { Users, LayoutGrid, DollarSign, ListTodo, Hotel, Gavel } from "lucide-react";

export default function Admin({ standalone = true }) {
  const adminSections = [
    {
      name: "Gerenciar Usuários",
      description: "Adicione, edite ou remova usuários do sistema.",
      icon: Users,
      link: "/admin/users",
      color: "primary",
    },
    {
      name: "Gerenciar Quartos",
      description: "Cadastre, visualize e gerencie os quartos do hotel.",
      icon: Hotel,
      link: "/admin/rooms",
      color: "secondary",
    },
    {
      name: "Regras de Preço",
      description: "Configure regras de preço para diferentes temporadas e demandas.",
      icon: DollarSign,
      link: "/admin/pricing-rules",
      color: "primary",
    },
    {
      name: "Log de Auditoria",
      description: "Visualize o histórico completo de operações e responsáveis.",
      icon: Gavel,
      link: "/admin/audit-log",
      color: "secondary",
    },
  ];

  const content = (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shadow-sm">
          <LayoutGrid className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="text-gray-500">Acesso rápido às ferramentas de gestão do hotel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link
            key={section.name}
            to={section.link}
            className={`block p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg
              hover:border-${section.color}-200 bg-white hover:bg-${section.color}-50`}
          >
            <div className={`w-10 h-10 bg-${section.color}-100 rounded-lg flex items-center justify-center mb-4`}>
              <section.icon className={`w-5 h-5 text-${section.color}-600`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{section.name}</h2>
            <p className="text-gray-600 text-sm">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );


  if (!standalone) return content;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {content}
    </div>
  );
}