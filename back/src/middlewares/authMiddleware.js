import { verifyAccess } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {

  // libera autenticação nos testes
  if (process.env.NODE_ENV === "test") {
    req.user = {
      id: 1,
      tipoUsuario: "ADMIN",
    };

    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não fornecido",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const payload = verifyAccess(token);

    req.user = payload;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Sua sessão expirou ou o token é inválido",
    });
  }
}