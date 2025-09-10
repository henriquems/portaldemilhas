import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UsuarioFormatado } from './usuario-formatado.interface';

export const UsuarioFormatadoDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UsuarioFormatado => {
    const request = ctx.switchToHttp().getRequest();
    const usuarioLogado = request.usuario;
    return {
      id: usuarioLogado.id!,
      perfis: (usuarioLogado.perfis || []).map((perfil: any) => perfil.nome as string),
    };
  },
);
