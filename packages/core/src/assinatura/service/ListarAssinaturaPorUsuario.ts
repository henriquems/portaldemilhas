import CasoDeUso from "../../shared/CasoDeUso";
import Assinatura from "../model/Assinatura";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";

type Entrada = {
    page: string
    pageSize: string
    planoId?: string
    usuario?: {
        id: number
        perfis: string[]
    }
}

type ResultadoListagem = {
    total: number;
    itens: Assinatura[];
};

export default class ListarAssinaturaPorUsuario implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioAssinatura) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, usuario, planoId } = entrada;
        return this.repositorio.listarPorUsuario(page, pageSize, usuario, planoId);
    }
}