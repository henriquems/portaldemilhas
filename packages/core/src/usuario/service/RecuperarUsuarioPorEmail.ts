
import CasoDeUso from "../../shared/CasoDeUso"
import Usuario from "../model/Usuario"
import RepositorioUsuario from "../provider/RepositorioUsuario"

type Entrada = {
    email: string
}

export default class RecuperarUsuarioPorEmail implements CasoDeUso<Entrada, Usuario> {
    constructor(private readonly repositorio: RepositorioUsuario){}
    
    async executar(entrada: Entrada): Promise<Usuario> {
        const { email } = entrada;
        if (!email) throw new Error('Email não pode ser vazio.');

        const usuario = await this.repositorio.recuperarUsuarioPorEmail(email);

        if (!usuario) {
            throw new Error('Usuário não encontrado!');
        }

        return usuario;
    }
}