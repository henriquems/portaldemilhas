import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthPrisma } from './auth.prisma';
import { ErroAplicacao, LoginAuth } from '@portaldemilhas/core';
import { BcryptProvider } from '../shared/bcrypt.provider';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly repositorio: AuthPrisma,
        private readonly cripto: BcryptProvider,
        private readonly jwtService: JwtService
    ){}

    @Post('/logar')
    async logar(@Body() dados: { email: string; senha: string }) {
        try {
            const casoDeUso = new LoginAuth(this.repositorio, this.cripto);
            const usuario = await casoDeUso.executar({ email: dados.email, senha: dados.senha });
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
            
            const chave = process.env.JWT_SECRET!;
            const token = this.jwtService.gerarToken(usuario);
            return token;
        } catch (erro) {
            if (erro instanceof ErroAplicacao) {
                switch (erro.codigo) {
                    case 'USUARIO_NAO_ENCONTRADO':
                        throw new HttpException({ message: 'Usuário não encontrado!' }, HttpStatus.NOT_FOUND);
                    case 'SENHA_INCORRETA':
                        throw new HttpException({ message: 'Senha incorreta!' }, HttpStatus.UNAUTHORIZED);
                }
            }
            throw new HttpException(
                { message: 'Erro interno' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
