import { Plano } from "../plano";

export type QrCodePix = {
  base64: string;
  code: string;
};

export type PagamentoProps = {
  assinaturaId: number;
  valor: number;
  plano: Plano;
};

export type DadosPagamentoCartaoComToken = {
  token: string;
  paymentMethodId: string;
  installments: number;
  issuer: string;
  cardholderName: string;
};

export interface DadosPagamentoPixOuBoletoDTO {
  email: string;
  assinaturaId: number;
  valor: number;
  descricao: string;
  nomeCliente: string;
}

export interface DadosCartaoDTO extends DadosPagamentoPixOuBoletoDTO {
  token: string;
  payment_method_id: string;
  installments: number;
}