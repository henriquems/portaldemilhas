import CasoDeUso from "../../shared/CasoDeUso";
import Anuncio from "../model/Anuncio"
import RepositorioAnuncio from "../provider/RepositorioAnuncio";

type Entrada = {
    id: number
}

export default class RecuperarAnuncio implements CasoDeUso<Entrada, Anuncio> {
    constructor(private readonly repositorio: RepositorioAnuncio){}
    
    async executar(entrada: Entrada): Promise<Anuncio> {
        const { id } = entrada
        
        if(!id) throw new Error('Id anuncio não informado!')
        
        const anuncio = await this.repositorio.recuperar(id);

        if(!anuncio) throw new Error('Anuncio não encontrado');
        
        return anuncio;
    }
}