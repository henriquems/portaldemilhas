import { Body, Controller, Post, Get } from '@nestjs/common';
import { PerfilPrisma } from './perfil.prisma';
import { CadastrarPerfil, ListarPerfil, Perfil } from '@portaldemilhas/core';

@Controller('perfis')
export class PerfilController {
    constructor(
        private readonly repositorio: PerfilPrisma){}

    @Get()
    async listar() {
        const casoDeUso = new ListarPerfil(this.repositorio);
        return await casoDeUso.executar();
    }
s
    @Post('/cadastro')
    async cadastrar(@Body() perfil: Perfil) {
        const casoDeUso = new CadastrarPerfil(this.repositorio);
        await casoDeUso.executar(perfil);
    }
}
