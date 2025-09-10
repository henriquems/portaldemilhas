import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioPrograma from "../provider/RepositorioPrograma";

type Entrada = {
    id: number
}

export default class ExcluirPrograma implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioPrograma){}
    
    async executar(entrada: Entrada): Promise<void> {
        const { id } = entrada
        if(!id) throw new Error('Programa não encontrado!')
        await this.repositorio.excluir(id)
    }
}