import { Paginacao } from "../../dto";
import Anuncio from "../model/Anuncio"

export default interface RepositorioAnuncio {
    listar(page: string, tamanho: string, programaId?: string, tipo?: string, quantidadeMinima?: string): Promise<Paginacao<Anuncio>>;
    listarPago(page: string, tamanho: string, programaId?: string): Promise<Paginacao<Anuncio>>;
    listarDestaques(): Promise<Anuncio[]>;
    listarPorUsuario(page: string, tamanho: string, usuario?: { id: number, perfis: string[] }, programaId?: string): Promise<Paginacao<Anuncio>>;
    recuperar(id: number): Promise<Anuncio | null>
    salvar(anuncio: Anuncio): Promise<void>
    excluir(id: number): Promise<void>
}