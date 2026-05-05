import { Router } from "express";
import { criarUsuario, 
         loginUsuario,
         esqueciSenha,
         resetarSenha,
         buscarUsuario,
         listarUsuarios,
         atualizarUsuario,
         deletarUsuario 
         } from "../controllers/UsuariosController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const usuarioRouter = Router();

usuarioRouter.post("/register", criarUsuario);

usuarioRouter.post("/login", loginUsuario);

usuarioRouter.post("/esqueci-senha", esqueciSenha);

usuarioRouter.post("/resetar-senha", resetarSenha);

usuarioRouter.get("/:id", authMiddleware, buscarUsuario);

usuarioRouter.get("/", authMiddleware, listarUsuarios);

usuarioRouter.put("/:id", authMiddleware, atualizarUsuario);

usuarioRouter.delete("/:id", authMiddleware, deletarUsuario);