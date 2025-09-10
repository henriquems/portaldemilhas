import CasoDeUso from "../../shared/CasoDeUso";
import Cupom from "../model/Cupom";
import RepositorioCupom from "../provider/RepositorioCupom";

type Entrada = {
    page: string
    pageSize: string
    nome?: string
    descricao?: string
    valorDesconto?: number
    status?: string
}

type ResultadoListagem = {
    total: number;
    itens: Cupom[];
};

export default class ListarCupom implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioCupom) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, nome, descricao, valorDesconto, status } = entrada;
        return this.repositorio.listar(page, pageSize, nome, descricao, valorDesconto, status);
    }
}