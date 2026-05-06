import { useState } from "react";
import  api  from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Shield, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";

export default function Register(){

    const navigate = useNavigate()

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [tipoUsuario, setTipoUsuario] = useState("USER")
    const [isLoading, setIsLoading] = useState(false)

    async function handleRegister(e){
        e.preventDefault()
        setIsLoading(true)

        try{
            await api.post("/usuario/register", {
                nome,
                email,
                senha,
                tipoUsuario
            })
            toast.success("Bem-vindo à equipe! Faça seu login para continuar.")
            navigate("/")
            
        }catch(error){
             const message = error.response?.data?.message || "Ocorreu um erro ao criar a conta.";
             toast.error(message);
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Organic background shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-brand-200/40 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-accent-200/40 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10">
                <div className="text-center">
                    <Logo to="/" iconClassName="mx-auto w-16 h-16 bg-gradient-to-tr from-accent-500 to-accent-300 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/30 transform rotate-3 hover:rotate-0 transition-transform duration-300" showText={false} />
                    <h2 className="mt-6 text-3xl font-black text-brand-900 tracking-tight">
                        Faça parte da equipe
                    </h2>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                        Crie sua conta e comece a gerenciar hoje mesmo.
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-brand-900 mb-1">Nome Completo</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-11 sm:text-sm border-gray-200 rounded-2xl py-3.5 transition-colors bg-gray-50/50 hover:bg-white"
                                    placeholder="Como quer ser chamado?"
                                    value={nome}
                                    onChange={e=>setNome(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-900 mb-1">E-mail</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-11 sm:text-sm border-gray-200 rounded-2xl py-3.5 transition-colors bg-gray-50/50 hover:bg-white"
                                    placeholder="voce@empresa.com"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-900 mb-1">Senha</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-11 sm:text-sm border-gray-200 rounded-2xl py-3.5 transition-colors bg-gray-50/50 hover:bg-white"
                                    placeholder="Mínimo 6 caracteres"
                                    value={senha}
                                    onChange={e=>setSenha(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-900 mb-1">Tipo de Acesso</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={tipoUsuario}
                                    onChange={(e) => setTipoUsuario(e.target.value)}
                                    className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-11 sm:text-sm border-gray-200 rounded-2xl py-3.5 transition-colors bg-gray-50/50 hover:bg-white appearance-none"
                                >
                                    <option value="USER">Membro da Equipe</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 shadow-xl shadow-indigo-500/30'}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Criando conta...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    Criar minha conta
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500">
                        Já tem uma conta?{' '}
                        <Link to="/" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                            Acesse por aqui
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
