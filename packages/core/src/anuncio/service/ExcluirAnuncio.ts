import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioAnuncio from "../provider/RepositorioAnuncio";

type Entrada = {
    id: number
}

export default class ExcluirAnuncio implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioAnuncio){}
    
    async executar(entrada: Entrada): Promise<void> {
        const { id } = entrada
        if(!id) throw new Error('Anuncio não encontrado!')
        await this.repositorio.excluir(id)
    }
}