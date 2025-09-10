import { ErroAplicacao } from './ErroAplicacao';

export class CupomNaoEncontrado extends ErroAplicacao {
    constructor() {
        super('CUPOM_NAO_ENCONTRADO', 'Cupom não encontrado ou expirado!');
    }
}