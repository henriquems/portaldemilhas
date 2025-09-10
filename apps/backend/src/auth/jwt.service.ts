import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Usuario } from '@portaldemilhas/core';

@Injectable()
export class JwtService {
  private readonly jwtSecret = process.env.JWT_SECRET!;

  verificarToken(token: string): Usuario {
    return jwt.verify(token, this.jwtSecret) as Usuario;
  }

  gerarToken(usuario: Usuario): string {
    const assinaturaStatus = usuario.assinaturas?.[0]?.status ?? null;

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      telefone: usuario.telefone,
      status: usuario.status,
      perfis: usuario.perfis,
      assinaturaStatus,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '15d',
    });
  }
}
