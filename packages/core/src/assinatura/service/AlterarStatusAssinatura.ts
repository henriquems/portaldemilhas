import CasoDeUso from "../../shared/CasoDeUso";
import Assinatura from "../model/Assinatura";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";

type Entrada = {
    assinatura: Assinatura
    status: string
}

export default class AlterarStatusAssinatura implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioAssinatura){}

    async executar(entrada: Entrada): Promise<void> {
        const { assinatura, status } = entrada
        await this.repositorio.alterarStatus(assinatura, status);
    }
}