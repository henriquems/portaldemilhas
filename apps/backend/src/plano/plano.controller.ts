import { Body, Controller, Post, Get, Delete, Param, Query } from '@nestjs/common';
import { PlanoPrisma } from './plano.prisma';
import { CadastrarPlano, ListarPlano, RecuperarPlano, ExcluirPlano, Plano } from '@portaldemilhas/core';

@Controller('planos')
export class PlanoController {
    constructor(
        private readonly repositorio: PlanoPrisma){}

    @Get()
    async listar(@Query("page") page: string, @Query("pageSize") pageSize: string) {
        const casoDeUso = new ListarPlano(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize });
    
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/:id')
    async recuperar(@Param('id') id: string): Promise<Plano> {
        const casoDeUso = new RecuperarPlano(this.repositorio);
        return await casoDeUso.executar({id: Number(id)});
    }
    
    @Post('/cadastro')
    async cadastrar(@Body() plano: Plano) {
        const casoDeUso = new CadastrarPlano(this.repositorio);
        await casoDeUso.executar(plano);
    }

    @Delete('/:id')
    async excluir(@Param('id') id: number) {
        const casoDeUso = new ExcluirPlano(this.repositorio);
        await casoDeUso.executar({id});
    }

}
