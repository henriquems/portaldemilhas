import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig } from 'mercadopago';
import { Preference } from 'mercadopago/dist/clients/preference';
import { Payment } from 'mercadopago/dist/clients/payment';
import { separarNome } from '@portaldemilhas/core';

@Injectable()
export class MercadoPagoService {
  private preference: Preference;
  private payment: Payment;

  constructor() {
    const mp = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    });

    this.preference = new Preference(mp);
    this.payment = new Payment(mp);
  }

  async buscarPagamento(id: number) {
    return await this.payment.get({ id });
  }

  async criarPreferencia(params: {
    usuarioId: number;
    assinaturaId: number;
    descricao: string;
    valor: number;
  }) {
    const preferenceData: any = {
      items: [
        {
          title: params.descricao,
          unit_price: params.valor,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      metadata: {
        usuarioId: params.usuarioId,
        assinaturaId: params.assinaturaId,
      },
      back_urls: {
        success: 'https://www.portaldemilhas.com.br/assinatura/sucesso',
        failure: 'https://www.portaldemilhas.com.br/assinatura/falha',
        pending: 'https://www.portaldemilhas.com.br/assinatura/pendente',
      },
      notification_url: process.env.MERCADO_PAGO_WEBHOOK_URL!,
      auto_return: 'all',
    };

    const response = await this.preference.create({ body: preferenceData });
    return response;
  }

  async realizarPagamentoComCartao(dados: {
    token: string;
    payment_method_id: string;
    installments: number;
    email: string;
    valor: number;
    assinaturaId: number;
    descricao: string;
    nomeCliente: string;
    identificationNumber?: string; 
  }) {
    const { first_name, last_name } = separarNome(dados.nomeCliente);

    try {
      const pagamento = await this.payment.create({
        body: {
          transaction_amount: dados.valor,
          token: dados.token,
          description: `Assinatura - ${dados.descricao}`,
          installments: dados.installments,
          payment_method_id: dados.payment_method_id,
          payer: {
            email: dados.email,
            first_name,
            last_name,
            identification: {
              type: 'CPF',
              number: dados.identificationNumber || '00000000000',
            },
          },
          metadata: {
            assinaturaId: dados.assinaturaId,
          },
          external_reference: dados.assinaturaId.toString(),
          statement_descriptor: 'PORTAL*MILHAS',
        },
      });

      return pagamento;
    } catch (error: any) {
      console.error('Erro no pagamento com cartão:', {
        message: error.message,
        cause: error.cause,
        details: error?.response?.data || error,
      });

      const detalhes =
        error?.cause?.message ||
        error?.message ||
        'Erro ao processar pagamento no Mercado Pago.';

      throw new Error(detalhes);
    }
  }

  async gerarPix({
    email,
    assinaturaId,
    valor,
    descricao,
    nomeCliente,
  }: {
    email: string;
    assinaturaId: number;
    valor: number;
    descricao: string;
    nomeCliente: string;
  }) {
    const { first_name, last_name } = separarNome(nomeCliente);

    const payment = await this.payment.create({
      body: {
        transaction_amount: valor,
        payment_method_id: 'pix',
        payer: {
          email,
          first_name,
          last_name,
        },
        description: `Assinatura - ${descricao}`,
        metadata: { assinaturaId },
        external_reference: assinaturaId.toString(),
        statement_descriptor: 'PORTAL*MILHAS',
      },
    });

    const {
      qr_code_base64,
      qr_code,
    } = payment.point_of_interaction.transaction_data;

    return { qrCodeBase64: qr_code_base64, code: qr_code, idPagamento: payment.id };
  }

  async gerarBoleto({
    email,
    assinaturaId,
    valor,
    nomeCliente,
    identificationNumber = '00000000000', 
  }: {
    email: string;
    assinaturaId: number;
    valor: number;
    nomeCliente: string;
    identificationNumber?: string;
  }) {
    const { first_name, last_name } = separarNome(nomeCliente);

    const payment = await this.payment.create({
      body: {
        transaction_amount: valor,
        payment_method_id: 'bolbradesco',
        payer: {
          email,
          first_name,
          last_name,
          identification: { type: 'CPF', number: identificationNumber },
          address: {
            zip_code: '06233200',
            street_name: 'Av. Teste',
            street_number: '123',
            neighborhood: 'Centro',
            city: 'Osasco',
            federal_unit: 'SP',
          },
        },
        description: `Assinatura ${assinaturaId}`,
        metadata: { assinaturaId },
        external_reference: assinaturaId.toString(),
        statement_descriptor: 'PORTAL*MILHAS',
      },
    });

    return { url: payment.transaction_details.external_resource_url, idPagamento: payment.id };
  }
}
