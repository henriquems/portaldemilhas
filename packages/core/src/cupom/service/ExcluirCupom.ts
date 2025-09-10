import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioCupom from "../provider/RepositorioCupom";

type Entrada = {
    id: number
}

export default class ExcluirCupom implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioCupom){}
    
    async executar(entrada: Entrada): Promise<void> {
        const { id } = entrada
        if(!id) throw new Error('Cupom não encontrado!')
        await this.repositorio.excluir(id)
    }
}