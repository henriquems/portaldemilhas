import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioPlano from "../provider/RepositorioPlano";

type Entrada = {
    id: number
}

export default class ExcluirPlano implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioPlano){}
    
    async executar(entrada: Entrada): Promise<void> {
        const { id } = entrada
        if(!id) throw new Error('Plano não encontrado!')
        await this.repositorio.excluir(id)
    }
}