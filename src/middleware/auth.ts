import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; email: string; iat: number; exp: number };
  }
}

class AuthMiddleware {
  private SECRET_JWT: string | undefined;
  private jwt: typeof jwt;

  constructor() {
    this.SECRET_JWT = process.env.JWT_SECRET;
    this.jwt = jwt;

    // Vincula o método ao this da instância
    this.authenticateToken = this.authenticateToken.bind(this);
  }

  public async authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    if (!this.SECRET_JWT) {
      return res.status(500).json({ error: "Internal server error" });
    }

    this.jwt.verify(token, this.SECRET_JWT, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido" });
      }

      req.user = payload as { id: number; email: string; iat: number; exp: number };
      next();
    });
  }
}

export default AuthMiddleware;
