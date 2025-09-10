import { ProvedorCriptografia, Usuario } from "../../usuario";
import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioAuth from "../provider/RepositorioAuth";
import { SenhaIncorreta, UsuarioNaoEncontrado } from "../../errors";

type Entrada = {
    email: string
    senha: string
}

export default class LoginAuth implements CasoDeUso<Entrada, Usuario> {
    constructor(
        private readonly repositorio: RepositorioAuth,
        private readonly cripto: ProvedorCriptografia
    ){}

    async executar(entrada: Entrada): Promise<Usuario> {
        const { email, senha } = entrada

        const usuario = await this.repositorio.logar(email)

        if (!usuario) throw new UsuarioNaoEncontrado();

        const mesmaSenha = await this.cripto.comparar(senha, usuario.senha)

        if (!mesmaSenha) throw new SenhaIncorreta();

        delete usuario.senha
        return usuario
    }
}