import { Paginacao } from "../../dto";
import Plano from "../model/Plano";

export default interface RepositorioPlano {
    listar(page: string, tamanho: string): Promise<Paginacao<Plano>>;
    recuperar(id: number): Promise<Plano | null>
    salvar(plano: Plano): Promise<void>
    excluir(id: number): Promise<void>
}