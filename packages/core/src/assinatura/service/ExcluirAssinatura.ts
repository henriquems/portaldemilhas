import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";
import RepositorioPlano from "../provider/RepositorioAssinatura";

type Entrada = {
    id: number
}

export default class ExcluirAssinatura implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioAssinatura){}
    
    async executar(entrada: Entrada): Promise<void> {
        const { id } = entrada
        if(!id) throw new Error('Assinatura não encontrada!')
        await this.repositorio.excluir(id)
    }
}