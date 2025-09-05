import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";

// role:['perfil x', 'perfil y']

export function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    // verificando se existe algum usuario ou se não existe a role inserida
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("Unauthorized");
    }

    next();
  };
}
