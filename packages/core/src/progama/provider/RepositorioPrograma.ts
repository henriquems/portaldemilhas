import { Paginacao } from "../../dto";
import Programa from "../model/Programa"

export default interface RepositorioPrograma {
    listar(page: string, tamanho: string): Promise<Paginacao<Programa>>;
    listarTodos(): Promise<Programa[]>
    recuperar(id: number): Promise<Programa | null>
    salvar(programa: Programa): Promise<void>
    excluir(id: number): Promise<void>
}