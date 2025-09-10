import CasoDeUso from "../../shared/CasoDeUso";
import Perfil from "../model/Perfil";
import RepositorioPerfil from "../provider/RepositorioPerfil";

export default class CadastrarPerfil implements CasoDeUso<Perfil, void> {
    constructor(private readonly repositorio: RepositorioPerfil){}

    async executar(perfil: Perfil): Promise<void> {
        const perfilExistente = await this.repositorio.buscarPorNome(perfil.nome);

        if(perfilExistente) {
            throw new Error('Perfil já existente')
        }

        await this.repositorio.salvar(perfil)
    }
}