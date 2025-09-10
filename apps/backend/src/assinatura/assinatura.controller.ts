import { Body, Controller, Post, Get, Delete, Param, Query, Patch } from '@nestjs/common';
import { AssinaturaPrisma } from './assinatura.prisma';
import { CadastrarAssinatura, ListarAssinatura, RecuperarAssinatura, ExcluirAssinatura, Assinatura, Usuario, ListarAssinaturaPorUsuario, RecuperarUsuario, AplicarCupomNaAssinatura, RecuperarAssinaturaQueContemCupomDoUsuario, PagamentoInfluencer, AlterarPagamentoInfluencer, TotalAssinaturaComCupom, TotalAssinaturaComCupomPago, SomarValorPagoComCupom, SomarValorAPagarComCupom } from '@portaldemilhas/core';
import { UsuarioPrisma } from 'src/usuario/usuario.prisma';
import { JwtService } from 'src/auth/jwt.service';
import { MercadoPagoService } from 'src/mercado/mercado.service';
import { UsuarioFormatado } from 'src/shared/usuario-formatado.interface';
import { UsuarioFormatadoDecorator } from 'src/shared/usuario-formatado.decorator';
import { CupomPrisma } from 'src/cupom/cupom.prisma';

@Controller('assinaturas')
export class AssinaturaController {
    constructor(
        private readonly repositorio: AssinaturaPrisma,
        private readonly jwtService: JwtService,
        private readonly usuarioRepo: UsuarioPrisma,
        private readonly mercadoPagoService: MercadoPagoService,
        private readonly repositorioCupom: CupomPrisma
    ){}

    @Get()
    async listar(@Query("page") page: string, @Query("pageSize") pageSize: string, @Query("planoId") planoId?: string) {
        const casoDeUso = new ListarAssinatura(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, planoId });
    
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/usuario')
    async listarPorUsuario(
        @Query("page") page: string,
        @Query("pageSize") pageSize: string, 
        @UsuarioFormatadoDecorator() usuario: UsuarioFormatado, 
        @Query("planoId") planoId?: string
    ) {
        const casoDeUso = new ListarAssinaturaPorUsuario(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, usuario, planoId });
    
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/meusCupons')
    async meusCupons(
        @Query("page") page: string, 
        @Query("pageSize") pageSize: string, 
        @UsuarioFormatadoDecorator() usuario: UsuarioFormatado 
    ) {
        const casoDeUso = new RecuperarAssinaturaQueContemCupomDoUsuario(this.repositorio);
        const resultado = await casoDeUso.executar({ page, pageSize, usuario: usuario });
        
        return {
            total: resultado.total,
            itens: resultado.itens
        };
    }

    @Get('/total-com-cupom')
    async recuperarTotalAssinaturaComCupom(@UsuarioFormatadoDecorator() usuario: UsuarioFormatado): Promise<number> {
        const casoDeUso = new TotalAssinaturaComCupom(this.repositorio);
        return await casoDeUso.executar({ usuario });
    }

    @Get('/total-com-cupom-pago')
    async recuperarTotalAssinaturaComCupomPago(@UsuarioFormatadoDecorator() usuario: UsuarioFormatado): Promise<number> {
        const casoDeUso = new TotalAssinaturaComCupomPago(this.repositorio);
        return await casoDeUso.executar({ usuario });
    }

    @Get('/soma-com-cupom-pago')
    async somarValorPagoComCupom(@UsuarioFormatadoDecorator() usuario: UsuarioFormatado, ): Promise<number> {
        const casoDeUso = new SomarValorPagoComCupom(this.repositorio);
        return await casoDeUso.executar({ usuario });
    }

    @Get('/soma-com-cupom-a-pagar')
    async somarValorAPagarComCupom(@UsuarioFormatadoDecorator() usuario: UsuarioFormatado, ): Promise<number> {
        const casoDeUso = new SomarValorAPagarComCupom(this.repositorio);
        return await casoDeUso.executar({ usuario });
    }

    @Get('/:id')
    async recuperar(@Param('id') id: string): Promise<Assinatura> {
        const casoDeUso = new RecuperarAssinatura(this.repositorio);
        return await casoDeUso.executar({ id: Number(id) });
    }

    @Post('/cadastro')
    async cadastrar(@Body() assinatura: Assinatura) {
        const casoDeUsoCadastrarAssinatura = new CadastrarAssinatura(this.repositorio);
        const assinaturaSalva = await casoDeUsoCadastrarAssinatura.executar(assinatura);

        const casoDeUsoUsuario = new RecuperarUsuario(this.usuarioRepo);
        const usuario = await casoDeUsoUsuario.executar({ id: Number(assinatura.usuario.id) });

        const token = this.jwtService.gerarToken(usuario);
        
        return {
            id: assinaturaSalva.id,
            valor: assinatura.plano.valor,
            token,
        }
    }

    @Post(':id/aplicar-cupom')
    async aplicarCupom(@Param('id') id: string, @Body('cupomId') cupomId: number) {
        const casoDeUso = new AplicarCupomNaAssinatura(this.repositorio, this.repositorioCupom);
        await casoDeUso.executar({ assinaturaId: Number(id), cupomId: Number(cupomId) });
    }

    @Post('/pagamento')
    async redirecionarPagamento(@Body() body: { id: number }) {
        const casoDeUso = new RecuperarAssinatura(this.repositorio);
        const assinatura = await casoDeUso.executar({ id: Number(body.id) });
       
        const preferencia = await this.mercadoPagoService.criarPreferencia({
            usuarioId: assinatura.usuario.id,
            assinaturaId: assinatura.id,
            descricao: assinatura.plano.descricao,
            valor: assinatura.plano.valor,
        });

        return {
            url: preferencia.init_point,
        };
    }

    @Delete('/:id')
    async excluir(@Param('id') id: number) {
        const casoDeUsoRecuperarAssinatura = new RecuperarAssinatura(this.repositorio);
        const assinatura = await casoDeUsoRecuperarAssinatura.executar({ id });
        const usuarioId = assinatura?.usuario?.id ?? null;

        const casoDeUsoExcluirAssinatura = new ExcluirAssinatura(this.repositorio);
        await casoDeUsoExcluirAssinatura.executar({ id });

        if (usuarioId) {
            const casoDeUsoUsuario = new RecuperarUsuario(this.usuarioRepo);
            const usuario = await casoDeUsoUsuario.executar({ id: usuarioId });

            const usuarioComAssinaturaStatus = {
                ...usuario,
                assinaturaStatus: null, 
            }

            const token = this.jwtService.gerarToken(usuarioComAssinaturaStatus);
            return { token }
        }
    }

    @Patch('pagamentoInfluencer/:id')
    async alterarPagamentoInfluencer(@Param('id') id: string, @Body('pagamentoInfluencer') pagamentoInfluencer: string) {
        const casoDeUso = new AlterarPagamentoInfluencer(this.repositorio);
        await casoDeUso.executar({ id: Number(id), pagamentoInfluencer });
        return { sucesso: true };
    }

}
