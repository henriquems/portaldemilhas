import { Controller, Post, Req, Res, Body, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { MercadoPagoService } from './mercado.service';
import { AssinaturaPrisma } from 'src/assinatura/assinatura.prisma';
import { EmailService } from 'src/email/email.service';
import { DadosCartaoDTO, DadosPagamentoPixOuBoletoDTO } from '@portaldemilhas/core';

@Controller('api')
export class MercadoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly assinaturaRepo: AssinaturaPrisma,
    private readonly emailService: EmailService,
  ) {}

  @Get('pagamento/status/:id')
  async verificarStatus(@Param('id') id: string) {
    const pagamento = await this.mercadoPagoService.buscarPagamento(Number(id));
    return {
      status: pagamento.status, 
      status_detail: pagamento.status_detail, 
    }
  }

  @Post('pagamento/pix')
  async gerarPix(@Body() dto: DadosPagamentoPixOuBoletoDTO) {
    return this.mercadoPagoService.gerarPix(dto);
  }

  @Post('pagamento/boleto')
  async gerarBoleto(@Body() dto: DadosPagamentoPixOuBoletoDTO) {
    return this.mercadoPagoService.gerarBoleto(dto);
  }

  @Post('pagamento/cartao')
  async pagarComCartao(@Body() dto: DadosCartaoDTO) {
    try {
      return await this.mercadoPagoService.realizarPagamentoComCartao(dto);
    } catch (error) {
      throw new HttpException(
        (error as any).message || 'Erro ao processar pagamento',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('webhook-mercado-pago')
  async receberNotificacao(@Req() req: Request, @Res() res: Response) {
    const userAgent = req.headers['user-agent'] ?? '';

    if (!userAgent.includes('MercadoPago')) {
      console.warn('Notificação suspeita recebida:', userAgent);
      return res.status(HttpStatus.FORBIDDEN).send('Acesso não autorizado');
    }

    try {
      const notificacao = req.body;
      console.log('Notificação recebida:', JSON.stringify(notificacao));

      if (notificacao.type !== 'payment') {
        console.warn('Tipo de notificação não tratado:', notificacao.type);
        return res.status(HttpStatus.OK).send('Tipo ignorado');
      }

      const pagamentoId = notificacao.data?.id;
      if (!pagamentoId) {
        console.warn('ID de pagamento ausente na notificação.');
        return res.status(HttpStatus.BAD_REQUEST).send('ID de pagamento ausente');
      }

      const pagamento = await this.mercadoPagoService.buscarPagamento(pagamentoId);
      if (!pagamento) {
        console.warn(`Pagamento ${pagamentoId} não encontrado`);
        return res.status(HttpStatus.NOT_FOUND).send('Pagamento não encontrado');
      }

      const status = pagamento.status;
      let assinaturaId = Number(pagamento.metadata?.assinaturaId);

      if (!assinaturaId && pagamento.external_reference) {
        assinaturaId = Number(pagamento.external_reference);
      }

      if (!assinaturaId || isNaN(assinaturaId)) {
        console.warn('Assinatura ID inválida ou ausente.');
        return res.status(HttpStatus.BAD_REQUEST).send('Assinatura ID inválida');
      }

      const statusAssinatura = this.mapearStatusPagamento(status);
      const assinatura = await this.assinaturaRepo.recuperar(assinaturaId);

      if (!assinatura) {
        console.warn(`Assinatura ${assinaturaId} não encontrada.`);
        return res.status(HttpStatus.NOT_FOUND).send('Assinatura não encontrada');
      }

      await this.assinaturaRepo.alterarStatus(assinatura, statusAssinatura);
      console.log(`Status da assinatura ${assinaturaId} atualizado para ${statusAssinatura}`);

      if (status === 'approved') {
        const valorPago = pagamento.transaction_amount;
        await this.assinaturaRepo.atualizarValorPago(assinatura.id, valorPago);

        const email = pagamento.payer?.email;
        if (email) {
          await this.emailService.enviarEmail(
            email,
            'Pagamento confirmado - Portal de Milhas',
            `<p>Olá!</p><p>Seu pagamento foi <strong>aprovado</strong> com sucesso.</p><p>Obrigado por usar o Portal de Milhas.</p>`,
          );
          console.log(`E-mail de confirmação enviado para ${email}`);
        }
      }

      return res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      console.error('Erro no webhook Mercado Pago:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erro interno');
    }
  }

  private mapearStatusPagamento(status: string): string {
    switch (status) {
      case 'approved':
        return 'PAGA';
      case 'rejected':
        return 'RECUSADA';
      case 'pending':
        return 'PENDENTE';
      default:
        return 'AGUARDANDO';
    }
  }
}
