import CasoDeUso from "../../shared/CasoDeUso";
import Anuncio from "../model/Anuncio";
import RepositorioAnuncio from "../provider/RepositorioAnuncio";

export default class ListarAnuncioDestaque implements CasoDeUso<null, Anuncio[]> {
    constructor(private readonly repositorio: RepositorioAnuncio) {}

    async executar(): Promise<Anuncio[]> {
        return this.repositorio.listarDestaques();
    }
}