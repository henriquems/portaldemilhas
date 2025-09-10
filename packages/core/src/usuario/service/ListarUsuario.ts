import CasoDeUso from "../../shared/CasoDeUso";
import Usuario from "../model/Usuario";
import RepositorioUsuario from "../provider/RepositorioUsuario";

type Entrada = {
    page: string
    pageSize: string
    nome?: string
    cpf?: string
    status?: string
    perfil?: string
}

type ResultadoListagem = {
    total: number;
    itens: Usuario[];
};

export default class ListarUsuario implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioUsuario) {}

    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, nome, cpf, status, perfil } = entrada;
        return this.repositorio.listar(page, pageSize, nome, cpf, status, perfil);
    }
}