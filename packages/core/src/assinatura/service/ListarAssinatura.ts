import CasoDeUso from "../../shared/CasoDeUso";
import Assinatura from "../model/Assinatura";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";
import RepositorioPlano from "../provider/RepositorioAssinatura";

type Entrada = {
    page: string
    pageSize: string
    planoId?: string
}

type ResultadoListagem = {
    total: number;
    itens: Assinatura[];
};

export default class ListarAssinatura implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioAssinatura) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, planoId } = entrada;
        return this.repositorio.listar(page, pageSize, planoId);
    }
}