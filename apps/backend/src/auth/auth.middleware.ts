import { Usuario } from '@portaldemilhas/core';
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { AuthPrisma } from './auth.prisma';
import * as jwt from 'jsonwebtoken'
import { JwtService } from './jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly repositorioAuth: AuthPrisma,
    private readonly jwtService: JwtService
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) throw new HttpException('Token não informado', 401);

      const payload = this.jwtService.verificarToken(token);  

      const usuario = await this.repositorioAuth.logar(payload.email);
      if (!usuario) throw new HttpException('Usuário não encontrado', 401);

      delete usuario.senha;
      req.usuario = usuario;

      next();
    } catch (error) {
      throw new HttpException('Token inválido', 401);
    }
  }
}
