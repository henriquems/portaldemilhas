import CasoDeUso from "../../shared/CasoDeUso";
import Anuncio from "../model/Anuncio";
import RepositorioAnuncio from "../provider/RepositorioAnuncio";

export default class CadastrarAnuncio implements CasoDeUso<Anuncio, void> {
    constructor(private readonly repositorio: RepositorioAnuncio){}

    async executar(anuncio: Anuncio): Promise<void> {
        await this.repositorio.salvar(anuncio);
    }
}