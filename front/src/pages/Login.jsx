import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../services/api'
import { saveUser } from "../utils/auth";
import { toast } from "react-toastify";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";


export default function Login(){
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogin(e){

        e.preventDefault()
        setIsLoading(true)

        try{
            const {data} = await api.post("/usuario/login", {
                email,
                senha
            })
            // console.log(data)
            saveUser(data)
            toast.success("Que bom ver você de novo!")

            const tipo = data.usuario?.tipoUsuario || data.tipoUsuario

            console.log("Tipo usuario:", data.usuario.tipoUsuario)

            if(data.usuario.tipoUsuario === "ADMIN"){
                // console.log("Entrando como ADMIN")
                navigate("/admin")
            }else{
                // console.log("Entrando como USER")
                navigate("/dashboard")
            }
            
            }catch(error){
                // console.error(error)
                const message = error.response?.data?.message || "O email e/ou a senha incorretos";
                toast.error(message);
                // navigate("/") // Já está na página de login, mas garante que permaneça se for o caso
            } finally {
                setIsLoading(false)
            }
        }

    return(
        <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Organic background shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] rounded-full bg-brand-200/40 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] -left-[10%] w-[30vw] h-[30vw] rounded-full bg-accent-200/40 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-brand-300/30 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10">
                <div className="text-center">
                    <Logo to="/" iconClassName="mx-auto w-16 h-16 bg-gradient-to-tr from-brand-600 to-brand-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300" showText={false} />
                    <h2 className="mt-6 text-3xl font-black text-brand-900 tracking-tight">
                        Acesse sua conta
                    </h2>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                        Insira seus dados para começar a gerenciar sua agenda.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-brand-900 mb-1">E-mail</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-11 sm:text-sm border-gray-200 rounded-2xl py-3.5 transition-colors bg-gray-50/50 hover:bg-white"
                                    placeholder="voce@empresa.com"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-bold text-brand-900">Senha</label>
                                <Link to="/esqueci-senha" className="text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors">
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-11 sm:text-sm border-gray-200 rounded-2xl py-3.5 transition-colors bg-gray-50/50 hover:bg-white"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={e=>setSenha(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 shadow-xl shadow-blue-500/30'}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Entrando...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    Entrar na plataforma
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500">
                        Novo por aqui?{' '}
                        <Link to="/register" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                            Faça parte da equipe
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
