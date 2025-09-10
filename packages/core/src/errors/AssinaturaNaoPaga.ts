import { ErroAplicacao } from "./ErroAplicacao";

export class AssinaturaNaoPaga extends ErroAplicacao {
  constructor() {
    super('ASSINATURA_NAO_PAGA', 'A assinatura do usuário não está paga.');
  }
}