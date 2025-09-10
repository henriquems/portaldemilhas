import CasoDeUso from "../../shared/CasoDeUso"
import RepositorioAssinatura from "../provider/RepositorioAssinatura"

type Entrada = {
    usuario: {
        id: number
        perfis: string[]
    }
}

export default class SomarValorAPagarComCupom implements CasoDeUso<Entrada, number> {
    constructor(private readonly repositorio: RepositorioAssinatura) {}

    async executar(entrada: Entrada): Promise<number> {
        const { usuario } = entrada
        return this.repositorio.somarValorAPagarComCupom(usuario);
    }
}