import { Body, Controller, Post, Get, Delete, Param, Query } from '@nestjs/common';
import { ProgramaPrisma } from './programa.prisma';
import { CadastrarPrograma, ListarPrograma, RecuperarPrograma, ExcluirPrograma, Programa, ListarTodosProgramas } from '@portaldemilhas/core';

@Controller('programas')
export class ProgramaController {
    constructor(
        private readonly repositorio: ProgramaPrisma){}

    @Get()
    async listar(@Query("page") page: string, @Query("pageSize") pageSize: string) {
        const casoDeUso = new ListarPrograma(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize });
    
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/todos')
    async listarTodos() {
        const casoDeUso = new ListarTodosProgramas(this.repositorio);
        return await casoDeUso.executar();
    }

    @Get('/:id')
    async recuperar(@Param('id') id: string): Promise<Programa> {
        const casoDeUso = new RecuperarPrograma(this.repositorio);
        return await casoDeUso.executar({id: Number(id)});
    }
    
    @Post('/cadastro')
    async cadastrar(@Body() programa: Programa) {
        const casoDeUso = new CadastrarPrograma(this.repositorio);
        await casoDeUso.executar(programa);
    }

    @Delete('/:id')
    async excluir(@Param('id') id: number) {
        const casoDeUso = new ExcluirPrograma(this.repositorio);
        await casoDeUso.executar({id});
    }

}
