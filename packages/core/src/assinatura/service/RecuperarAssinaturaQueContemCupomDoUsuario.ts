import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";
import Assinatura from "../model/Assinatura"
import { Usuario } from "../../usuario";

type Entrada = {
    page: string
    pageSize: string
    usuario?: {
        id: number
        perfis: string[]
    }
}

type ResultadoListagem = {
    total: number;
    itens: Assinatura[];
};

export default class RecuperarAssinaturaQueContemCupomDoUsuario implements CasoDeUso<Entrada, ResultadoListagem> {
    constructor(private readonly repositorio: RepositorioAssinatura){}
    
    async executar(entrada: Entrada): Promise<ResultadoListagem> {
        const { page, pageSize, usuario } = entrada;
        return this.repositorio.recuperarAssinaturaQueContemCupomDoUsuario(page, pageSize, usuario);
    }
}