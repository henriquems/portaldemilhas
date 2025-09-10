import { ErroAplicacao } from './ErroAplicacao';

export class SenhaIncorreta extends ErroAplicacao {
    constructor() {
        super('SENHA_INCORRETA', 'Senha incorreta!');
    }
}