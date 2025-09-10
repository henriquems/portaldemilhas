import CasoDeUso from "../../shared/CasoDeUso";
import Anuncio from "../model/Anuncio";
import RepositorioAnuncio from "../provider/RepositorioAnuncio";

type Entrada = {
    page: string
    pageSize: string
    programaId?: string
}

type ResultadoListagem = {
    total: number;
    itens: Anuncio[];
};

export default class ListarAnuncioPago implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioAnuncio) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, programaId } = entrada;
        return this.repositorio.listarPago(page, pageSize, programaId);
    }
}