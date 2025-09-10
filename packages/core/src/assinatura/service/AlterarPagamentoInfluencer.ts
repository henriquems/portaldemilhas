import CasoDeUso from "../../shared/CasoDeUso";
import Assinatura from "../model/Assinatura";
import { PagamentoInfluencer } from "../model/PagamentoInfluencer";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";

type Entrada = {
    id: number
    pagamentoInfluencer: string
}

export default class AlterarPagamentoInfluencer implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioAssinatura){}

    async executar(entrada: Entrada): Promise<void> {
        const { id, pagamentoInfluencer } = entrada
        await this.repositorio.alterarPagamentoInfluencer(id, pagamentoInfluencer);
    }
}