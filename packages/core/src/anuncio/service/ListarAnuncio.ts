import CasoDeUso from "../../shared/CasoDeUso";
import Anuncio from "../model/Anuncio";
import RepositorioAnuncio from "../provider/RepositorioAnuncio";

type Entrada = {
    page: string
    pageSize: string
    programaId?: string
    tipo?: string,
    quantidadeMinima?: string
}

type ResultadoListagem = {
    total: number;
    itens: Anuncio[];
};

export default class ListarAnuncio implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioAnuncio) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, programaId, tipo, quantidadeMinima } = entrada;
        return this.repositorio.listar(page, pageSize, programaId, tipo, quantidadeMinima);
    }
}