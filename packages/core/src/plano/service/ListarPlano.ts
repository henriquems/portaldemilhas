import CasoDeUso from "../../shared/CasoDeUso";
import Plano from "../model/Plano";
import RepositorioPlano from "../provider/RepositorioPlano";

type Entrada = {
    page: string
    pageSize: string
}

type ResultadoListagem = {
    total: number;
    itens: Plano[];
};

export default class ListarPlano implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioPlano) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize } = entrada;
        return this.repositorio.listar(page, pageSize);
    }
}