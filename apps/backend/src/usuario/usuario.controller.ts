import { Body, Controller, Post, Get, Delete, Param, Query, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsuarioPrisma } from './usuario.prisma';
import { CadastrarUsuario, ExcluirUsuario, ListarUsuario, ListarUsuarioInfluencer, mascararEmail, NovaSenha, ProvedorEmail, RecuperarUsuario, Usuario, UsuarioNaoEncontrado } from '@portaldemilhas/core';
import { BcryptProvider } from 'src/shared/bcrypt.provider';

@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly repositorio: UsuarioPrisma,
        private readonly cripto: BcryptProvider,
        private readonly provedorEmail: ProvedorEmail
    ){}

    @Get()
    async listar(@Query("page") page: string, @Query("pageSize") pageSize: string, 
        @Query("nome") nome?: string,
        @Query("cpf") cpf?: string,
        @Query("status") status?: string,
        @Query("perfil") perfil?: string) {
        const casoDeUso = new ListarUsuario(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, nome, cpf, status, perfil });
    
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    } 
    
    @Get('/influencer')
    async listarUsuarioInfluencer() {
        const casoDeUso = new ListarUsuarioInfluencer(this.repositorio);
        return await casoDeUso.executar();
    }

    @Get('/:id')
    async recuperar(@Param('id') id: string) {
        const casoDeUso = new RecuperarUsuario(this.repositorio);
        return await casoDeUso.executar({id: Number(id)});
    }

    @Post('/cadastro')
    async cadastrar(@Body() usuario: Usuario) {
        const casoDeUso = new CadastrarUsuario(this.repositorio, this.cripto);
        await casoDeUso.executar(usuario);
    }

    @Delete('/:id')
    async excluir(@Param('id') id: number) {
        const casoDeUso = new ExcluirUsuario(this.repositorio);
        await casoDeUso.executar({id});
    }

    @Post('/novaSenha')
    async alterarSenha(@Body() dados: { email: string }) {
        try {
            const casoDeUso = new NovaSenha(this.repositorio, this.cripto, this.provedorEmail);
            const email = await casoDeUso.executar({ email: dados.email });

            const emailMascarado = mascararEmail(email);
            return { message: `Senha enviada para o e-mail de cadastro`, email: emailMascarado };
        } catch (erro) {
            if (erro instanceof UsuarioNaoEncontrado) {
                throw new HttpException({
                    message: `Usuário não encontrado com o e-mail ${dados.email}`
                }, HttpStatus.NOT_FOUND);
            }

            throw new HttpException({ message: 'Erro interno' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
