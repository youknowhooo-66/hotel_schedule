import { useState, useEffect } from "react";
import { User, Mail, Lock, Shield } from "lucide-react";

export default function UsuarioForm({ onSubmit, usuarioSelecionado }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipoUsuario: "USER",
  });

  useEffect(() => {
    if (usuarioSelecionado) {
      setForm({
        ...usuarioSelecionado,
        senha: "",
      });
    } else {
      setForm({
        nome: "",
        email: "",
        senha: "",
        tipoUsuario: "USER",
      });
    }
  }, [usuarioSelecionado]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
    if (!usuarioSelecionado) {
      setForm({ nome: "", email: "", senha: "", tipoUsuario: "USER" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="nome"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 transition-colors bg-white"
              placeholder="Nome do usuário"
              value={form.nome}
              onChange={handleChange}
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
              name="email"
              type="email"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 transition-colors bg-white"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!usuarioSelecionado && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="senha"
                type="password"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 transition-colors bg-white"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuário</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="tipoUsuario"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 transition-colors bg-white appearance-none"
              value={form.tipoUsuario}
              onChange={handleChange}
            >
              <option value="USER">USER (Usuário Padrão)</option>
              <option value="ADMIN">ADMIN (Administrador)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {usuarioSelecionado ? "Atualizar Dados do Usuário" : "Criar Novo Usuário"}
        </button>
      </div>
    </form>
  );
}