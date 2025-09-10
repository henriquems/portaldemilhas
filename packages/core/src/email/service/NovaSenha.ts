import CasoDeUso from "../../shared/CasoDeUso";
import { UsuarioNaoEncontrado } from "../../errors";
import { gerarSenhaAleatoria } from "../../util";
import { ProvedorCriptografia, RepositorioUsuario } from "../../usuario";
import { ProvedorEmail } from "../provider/ProvedorEmail";

type Entrada = {
    email: string
}

export default class NovaSenha implements CasoDeUso<Entrada, string> {
    constructor(
        private readonly repositorio: RepositorioUsuario,
        private readonly cripto: ProvedorCriptografia,
        private readonly provedorEmail: ProvedorEmail
    ){}

    async executar(entrada: Entrada): Promise<string> {
        const { email } = entrada

        const usuario = await this.repositorio.recuperarUsuarioPorEmail(email);
        if (!usuario) throw new UsuarioNaoEncontrado();

        const senhaAleatoria = gerarSenhaAleatoria(6);
        const novaSenha = await this.cripto.criptografar(senhaAleatoria);

        await this.repositorio.alterarSenha(novaSenha, usuario.id!);
        
        const valor = `Olá ${usuario.nome}, sua nova senha para acesso ao site Portal de Milhas é: ${senhaAleatoria}`;
        await this.provedorEmail.enviarEmail(usuario.email, 'Nova senha de acesso', valor);

        return usuario.email
    }
}