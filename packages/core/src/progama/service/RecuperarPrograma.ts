import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioPrograma from "../provider/RepositorioPrograma";
import Programa from "../model/Programa"

type Entrada = {
    id: number
}

export default class RecuperarPrograma implements CasoDeUso<Entrada, Programa> {
    constructor(private readonly repositorio: RepositorioPrograma){}
    
    async executar(entrada: Entrada): Promise<Programa> {
        const { id } = entrada

        const programa = await this.repositorio.recuperar(id);

        if(!programa) throw new Error('Programa não encontrado');
        
        return programa;
    }
}