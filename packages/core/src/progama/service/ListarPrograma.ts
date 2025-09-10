import CasoDeUso from "../../shared/CasoDeUso";
import Programa from "../model/Programa";
import RepositorioUsuario from "../provider/RepositorioPrograma";

type Entrada = {
    page: string
    pageSize: string
}

type ResultadoListagem = {
    total: number;
    itens: Programa[];
};

export default class ListarPrograma implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioUsuario) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize } = entrada;
        return this.repositorio.listar(page, pageSize);
    }
}