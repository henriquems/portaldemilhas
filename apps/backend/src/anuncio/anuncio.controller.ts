import { Body, Controller, Post, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { AnuncioPrisma } from './anuncio.prisma';
import { ListarAnuncio, ListarAnuncioPago,  RecuperarAnuncio, Anuncio, CadastrarAnuncio, ExcluirAnuncio, Usuario, ListarAnuncioPorUsuario, ListarAnuncioDestaque } from '@portaldemilhas/core';
import { UsuarioLogado } from 'src/shared/usuario.decorator';
import { AssinaturaGuard } from 'src/auth/assinatura.guard';

@Controller('anuncios')
export class AnuncioController {
    constructor(private readonly repositorio: AnuncioPrisma){}
    
    @Get()
    @UseGuards(AssinaturaGuard)
    async listar(
        @Query("page") page: string, 
        @Query("pageSize") pageSize: string, 
        @Query("programaId") programaId?: string, 
        @Query("tipo") tipo?: string,
        @Query("quantidadeMinima") quantidadeMinima?: string,
    ) {   
        const casoDeUso = new ListarAnuncio(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, programaId, tipo, quantidadeMinima });
        
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/pago')
    @UseGuards(AssinaturaGuard)
    async listarPago(@Query("page") page: string, @Query("pageSize") pageSize: string, @Query("programaId") programaId?: string) {
        const casoDeUso = new ListarAnuncioPago(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, programaId });
        
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/destaque')
    async listarDestaques() {
        try {
            const casoDeUso = new ListarAnuncioDestaque(this.repositorio);
            return await casoDeUso.executar();  
        } catch (error) {
            throw error;
        }
    }

    @Get('/usuario')
    async listarPorUsuario(@Query("page") page: string, @Query("pageSize") pageSize: string, @UsuarioLogado() usuarioLogado: Usuario, @Query("programaId") programaId?: string) {
        const usuario = {
            id: usuarioLogado.id!,
            perfis: (usuarioLogado.perfis || []).map(perfil => perfil.nome as string),
        };
        
        const casoDeUso = new ListarAnuncioPorUsuario(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, usuario, programaId });
    
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/:id')
    @UseGuards(AssinaturaGuard)
    async recuperar(@Param('id') id: string): Promise<Anuncio> {
        const casoDeUso = new RecuperarAnuncio(this.repositorio);
        return await casoDeUso.executar({id: Number(id)});
    }
    
    @Post('/cadastro')
    @UseGuards(AssinaturaGuard)
    async cadastrar(@Body() anuncio: Anuncio) {
        const casoDeUso = new CadastrarAnuncio(this.repositorio);
        await casoDeUso.executar(anuncio);
    }

    @Delete('/:id')
    @UseGuards(AssinaturaGuard)
    async excluir(@Param('id') id: number) {
        const casoDeUso = new ExcluirAnuncio(this.repositorio);
        await casoDeUso.executar({id});
    }
}
