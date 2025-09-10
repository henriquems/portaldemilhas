import { Paginacao } from "../../dto";
import Cupom from "../model/Cupom"

export default interface RepositorioCupom {
    listar(page: string, tamanho: string, nome: string, descricao: string, valorDesconto: number, status: string,): Promise<Paginacao<Cupom>>;
    recuperar(id: number): Promise<Cupom | null>;
    verificarCupom(descricao: string): Promise<Cupom | null>;
    salvar(cupom: Cupom): Promise<void>;
    excluir(id: number): Promise<void>;
}