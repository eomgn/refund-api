import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

interface TokenPayload {
  role: string;
  sub: string;
}

export function ensureAutheticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    // recuperando header de autenticacao e verificando se existe na requisicao
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT Token not found", 401);
    }

    // desestruturando token mas removendo Bearer: [Bearer, token]
    const [bearer, token] = authHeader;

    // verificando token passado
    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload;

    // criando user em Request do Express
    request.user = {
      role,
      user_id,
    };

    next();
  } catch (error) {
    throw new AppError("Invalid JWT Token");
  }
}
