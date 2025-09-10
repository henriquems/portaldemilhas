import CasoDeUso from "../../shared/CasoDeUso";
import Perfil from "../model/Perfil";
import RepositorioPerfil from "../provider/RepositorioPerfil";

export default class ListarPerfil implements CasoDeUso<null, Perfil[]> {
    constructor(private readonly repositorio: RepositorioPerfil){}

    async executar(): Promise<Perfil[]> {
       return this.repositorio.listar();
    }
}