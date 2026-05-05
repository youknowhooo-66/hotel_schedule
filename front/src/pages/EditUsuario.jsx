import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api  from '../services/api';
import UsuarioForm from '../components/UsuarioForm/UsuarioForm';
import { toast } from 'react-toastify';
import { ArrowLeft, UserCog } from 'lucide-react';
import { getUser, saveUser } from '../utils/auth';

export default function EditUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const res = await api.get(`/usuario/${id}`);
        setUsuario(res.data);
      } catch (err) {
        toast.error("Erro ao carregar usuário");
      } finally {
        setLoading(false);
      }
    }
    fetchUsuario();
  }, [id]);

  async function handleSubmit(formData) {
    try {
      await api.put(`/usuario/${id}`, formData);
      
      const loggedUser = getUser();
      if (loggedUser && (loggedUser.usuario?.id === parseInt(id) || loggedUser.id === parseInt(id))) {
        const updatedUser = { 
          ...loggedUser, 
          usuario: { ...(loggedUser.usuario || loggedUser), nome: formData.nome } 
        };
        saveUser(updatedUser);
      }

      toast.success("Usuário atualizado com sucesso!");
      navigate('/admin');
    } catch (err) {
      toast.error("Erro ao atualizar usuário");
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserCog className="w-6 h-6 text-purple-600" />
            </div>
            Editar Usuário
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Atualize as informações do usuário do sistema.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10">
          {usuario && (
            <UsuarioForm
              onSubmit={handleSubmit}
              usuarioSelecionado={usuario}
            />
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
             <button
              onClick={() => navigate('/admin')}
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
