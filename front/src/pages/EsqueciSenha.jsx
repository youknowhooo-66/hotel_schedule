import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export default function EsqueciSenha(){
    const [email,setEmail] = useState("")
    async function fazerCadastro() {
        email.preventDefault()
        try{
            await api.post("esqueci-senha", {email})
            toast.success("Email de recuperação enviado")            
        }catch(error){
            toast.error("Erro ao enviar o email")
        }
    }
    return(
        <form onSubmit={EsqueciSenha}>
            <input
            type="email"
            placeholder="Digite seu email"
            onChange={e=>setEmail(e.target.value)}
            />
            <button>Enviar</button>
        </form>
    )
}