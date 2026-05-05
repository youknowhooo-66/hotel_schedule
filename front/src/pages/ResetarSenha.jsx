import { useState } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"
import { toast } from "react-toastify"

export default function ResetarSenha(){
    const {token} = useParams()

    const [senha,setSenha] = useState("")
    const [confirmar,setConfirmar] = useState("")
    
    async function fazerCadastro(){
        e.preventDefault()
        try{
            await api.post("resetar-senha",{
                token,
                senha,
                confirmarSenha: confirmar
            })
            toast.success("Senha alterada com sucesso")
        }catch{
            toast.error("Eerro ao alterar senha")
        }
    }
    return(
        <form onSubmit={fazerCadastro}>
            <input
            type="password"
            placeholder="Nova senha"
            onChange={e=>setSenha(e.target.value)}
            />
            <input
            type="password"
            placeholder="Confirmar senha"
            onChange={e=>setConfirmar(e.target.value)}
            />
            <button>Alterar senha</button>
        </form>
    )
}