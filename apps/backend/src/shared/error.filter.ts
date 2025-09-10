import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErroAplicacao } from '@portaldemilhas/core';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export default class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let codigo = 'ERRO_INTERNO';
    let mensagem = 'Erro interno do servidor';

    if (exception instanceof ErroAplicacao) {
      status = (exception as any).status ?? HttpStatus.FORBIDDEN;
      codigo = exception.codigo;
      mensagem = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resposta = exception.getResponse();

      if (typeof resposta === 'object' && resposta !== null) {
        const res = resposta as any;
        if (Array.isArray(res.message)) {
          mensagem = res.message.join(', ');
        } else if (typeof res.message === 'string') {
          mensagem = res.message;
        } else {
          mensagem = JSON.stringify(res);
        }
      } else if (typeof resposta === 'string') {
        mensagem = resposta;
      }

      codigo = HttpStatus[status] ?? 'ERRO_HTTP';
    }

    if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as any).code === 'P2002'
    ) {
      const prismaError = exception as PrismaClientKnownRequestError;
      const alvo = prismaError.meta?.target as string[] | undefined;
      status = HttpStatus.CONFLICT;
      codigo = 'DUPLICADO';

      if (alvo?.includes('cpf')) {
        mensagem = 'CPF já cadastrado';
      } else if (alvo?.includes('email')) {
        mensagem = 'E-mail já cadastrado';
      } else {
        mensagem = `Registro duplicado${alvo ? ` (${alvo.join(', ')})` : ''}`;
      }
    } else if (exception instanceof Error && (!mensagem || mensagem === '')) {
      mensagem = exception.message;
      codigo = mensagem;
    }

    console.error('Erro capturado no filtro:', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: mensagem,
      errorCode: codigo,
      detalhes: mensagem,
    });
  }
}
