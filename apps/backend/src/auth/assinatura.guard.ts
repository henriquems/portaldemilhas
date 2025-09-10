import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Usuario } from '@portaldemilhas/core';
import { Request } from 'express';

export interface RequestComUsuario extends Request {
  usuario: Usuario;
}

@Injectable()
export class AssinaturaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestComUsuario>();
    const usuario = req.usuario;

    const ultimaAssinatura = usuario?.assinaturas?.[0];
    
    if (!ultimaAssinatura || ultimaAssinatura.status !== 'PAGA') {
        throw new ForbiddenException('ASSINATURA_NAO_PAGA');
    }

    return true;
  }
}
