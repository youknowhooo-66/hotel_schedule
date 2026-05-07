import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import  api from "../services/api";
import { toast } from "react-toastify";
import { Users, Shield, User, Edit2, Trash2, ShieldAlert } from "lucide-react";

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);

  async function carregarUsuarios() {
    try {
      const res = await api.get("/usuario");
      setUsuarios(res.data);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function deletar(id) {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      try {
        await api.delete(`/usuario/${id}`);
        toast.success("Usuário desativado com sucesso!");
        carregarUsuarios();
      } catch (error) {
        toast.error("Erro ao excluir usuário");
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-500">Adicione, edite ou remova usuários do sistema</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuário</th>
                <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {u.nome?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{u.nome}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${
                        u.tipoUsuario === "ADMIN"
                          ? "bg-primary-50 text-primary-700 border-primary-200"
                          : "bg-secondary-50 text-secondary-700 border-secondary-200"
                      }`}
                    >
                      {u.tipoUsuario === "ADMIN" ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      {u.tipoUsuario}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/admin/edit/${u.id}`}
                        className="text-primary-600 hover:text-primary-900 bg-primary-50 p-2 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => deletar(u.id)}
                        className="text-secondary-600 hover:text-secondary-900 bg-secondary-50 p-2 rounded-lg transition-colors"
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
        </div>

        {usuarios.length === 0 && (
          <div className="py-12 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário</h3>
            <p className="mt-1 text-sm text-gray-500">
              Nenhum usuário foi encontrado no sistema.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}