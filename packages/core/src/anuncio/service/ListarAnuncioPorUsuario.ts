import CasoDeUso from "../../shared/CasoDeUso";
import Anuncio from "../model/Anuncio";
import RepositorioAnuncio from "../provider/RepositorioAnuncio";

type Entrada = {
    page: string
    pageSize: string
    programaId?: string
    usuario?: {
        id: number
        perfis: string[]
    }
}

type ResultadoListagem = {
    total: number;
    itens: Anuncio[];
};

export default class ListarAnuncioPorUsuario implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioAnuncio) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, usuario, programaId } = entrada;
        return this.repositorio.listarPorUsuario(page, pageSize, usuario, programaId);
    }
}