import { ErroAplicacao } from './ErroAplicacao';

export class UsuarioNaoEncontrado extends ErroAplicacao {
    constructor() {
        super('USUARIO_NAO_ENCONTRADO', 'Usuário não encontrado!');
    }
}