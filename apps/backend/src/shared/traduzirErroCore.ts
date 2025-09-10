import { HttpException, HttpStatus } from '@nestjs/common';
import { ErroAplicacao } from '@portaldemilhas/core'

export function traduzirErroCore(erro: unknown): never {
    if (erro instanceof ErroAplicacao) {
        switch (erro.codigo) {
            case 'USUARIO_NAO_ENCONTRADO':
                throw new HttpException(erro.message, HttpStatus.NOT_FOUND);
            case 'SENHA_INCORRETA':
                throw new HttpException(erro.message, HttpStatus.UNAUTHORIZED);
            default:
                throw new HttpException(erro.message, HttpStatus.BAD_REQUEST);
        }
    }

    throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
}