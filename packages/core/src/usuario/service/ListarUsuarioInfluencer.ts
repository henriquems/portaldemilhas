import CasoDeUso from "../../shared/CasoDeUso";
import Usuario from "../model/Usuario";
import RepositorioUsuario from "../provider/RepositorioUsuario";

export default class ListarUsuarioInfluencer implements CasoDeUso<null, Usuario[] | null> {
    constructor(private readonly repositorio: RepositorioUsuario){}

    async executar(): Promise<Usuario[] | null> {
       return this.repositorio.listarUsuarioInfluencer();
    }
}