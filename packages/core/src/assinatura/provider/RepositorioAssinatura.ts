import { Paginacao } from "../../dto";
import Assinatura from "../model/Assinatura";

export default interface RepositorioAssinatura {
    listar(page: string, tamanho: string, planoId?: string): Promise<Paginacao<Assinatura>>;
    listarPorUsuario(page: string, tamanho: string, usuario?: { id: number, perfis: string[] }, planoId?: string): Promise<Paginacao<Assinatura>>;
    recuperar(id: number): Promise<Assinatura | null>
    recuperarUltimaAssinaturaDoUsuario(usaurioId: number): Promise<Assinatura | null>
    salvar(assinatura: Assinatura): Promise<Assinatura>
    excluir(id: number): Promise<void>
    alterarStatus(assinatura: Assinatura, status: string): Promise<void>;
    atualizarValorPago(id: number, valorPago: number): Promise<void>;
    aplicarCupom(assinaturaId: number, cupomId: number): Promise<void>;
    recuperarAssinaturaQueContemCupomDoUsuario(page: string, tamanho: string, usuario?: { id: number, perfis: string[] }): Promise<Paginacao<Assinatura>>;
    alterarPagamentoInfluencer(id: number, pagamentoInfluencer: string): Promise<void>;
    recuperarTotalAssinaturaComCupom(usuario: { id: number, perfis: string[] }): Promise<number>;
    recuperarTotalAssinaturaComCupomPago(usuario: { id: number, perfis: string[] }): Promise<number>;
    somarValorPagoComCupom(usuario: { id: number, perfis: string[] }): Promise<number>;
    somarValorAPagarComCupom(usuario: { id: number, perfis: string[] }): Promise<number>;
}