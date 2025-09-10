import { Body, Controller, Post, Get, Delete, Param, Query } from '@nestjs/common';
import { CupomPrisma } from './cupom.prisma';
import { CadastrarCupom, Cupom, ExcluirCupom, ListarCupom, RecuperarCupom, VerificarCupom } from '@portaldemilhas/core';

@Controller('cupons')
export class CupomController {
    constructor(
        private readonly repositorio: CupomPrisma,
    ){}

    @Get()
    async listar(@Query("page") page: string, @Query("pageSize") pageSize: string, 
        @Query("nome") nome?: string,
        @Query("descricao") descricao?: string,
        @Query("valorDesconto") valorDesconto?: number,
        @Query("status") status?: string) {
        const casoDeUso = new ListarCupom(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, nome, descricao, valorDesconto, status });
    
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }   

    @Get('/:id')
    async recuperar(@Param('id') id: string) {
        const casoDeUso = new RecuperarCupom(this.repositorio);
        return await casoDeUso.executar({id: Number(id)});
    }

    @Get('/verificar/:descricao')
    async verificarCupom(@Param('descricao') descricao: string) {
        const casoDeUso = new VerificarCupom(this.repositorio);
        return await casoDeUso.executar({descricao});
    }

    @Post('/cadastro')
    async cadastrar(@Body() cupom: Cupom) {
        const casoDeUso = new CadastrarCupom(this.repositorio);
        await casoDeUso.executar(cupom);
    }

    @Delete('/:id')
    async excluir(@Param('id') id: number) {
        const casoDeUso = new ExcluirCupom(this.repositorio);
        await casoDeUso.executar({id});
    }

}
