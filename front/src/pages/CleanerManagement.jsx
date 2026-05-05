import { useState, useEffect } from "react";
import api  from "../services/api";
import { toast } from "react-toastify";
import { Briefcase, User, Mail, Phone, Edit2, Trash2, Plus, X } from "lucide-react";

export default function CleanerManagement() {
  const [cleaners, setCleaners] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    try {
      const res = await api.get("/cleaner");
      setCleaners(res.data);
    } catch (error) {
      toast.error("Erro ao carregar profissionais");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/cleaner/${editandoId}`, formData);
        toast.success("Profissional atualizado!");
        setEditandoId(null);
      } else {
        await api.post("/cleaner", formData);
        toast.success("Profissional criado!");
      }
      setFormData({ name: "", email: "", phone: "" });
      carregar();
    } catch (error) {
      toast.error("Erro ao salvar profissional");
    }
  }

  function editar(cleaner) {
    setEditandoId(cleaner.id);
    setFormData({ name: cleaner.name, email: cleaner.email, phone: cleaner.phone || "" });
  }

  async function deletar(id) {
    if (window.confirm("Excluir este profissional?")) {
      try {
        await api.delete(`/cleaner/${id}`);
        toast.success("Profissional excluído!");
        carregar();
      } catch (error) {
        toast.error("Erro ao excluir");
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Profissionais</h1>
          <p className="text-gray-500">Adicione, edite ou remova profissionais do sistema</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              {editandoId ? (
                <><Edit2 className="w-5 h-5 text-blue-600"/> Editar Profissional</>
              ) : (
                <><Plus className="w-5 h-5 text-blue-600"/> Novo Profissional</>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 transition-colors" 
                    placeholder="Nome do profissional" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 transition-colors" 
                    placeholder="email@exemplo.com" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (Opcional)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 transition-colors" 
                    placeholder="(00) 00000-0000" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                  <button type="submit" className="flex-1 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm shadow-blue-500/30">
                    {editandoId ? "Salvar Alterações" : "Adicionar"}
                  </button>
                  {editandoId && (
                    <button 
                      type="button" 
                      onClick={() => {setEditandoId(null); setFormData({name:"", email:"", phone:""})}} 
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-colors font-medium px-4"
                      title="Cancelar edição"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Profissional</th>
                    <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</th>
                    <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cleaners.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{c.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                           <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                           {c.email}
                        </div>
                        {c.phone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            {c.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => editar(c)} 
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deletar(c.id)} 
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
              {cleaners.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum profissional</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comece adicionando profissionais no formulário ao lado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
