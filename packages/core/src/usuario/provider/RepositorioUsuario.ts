import { Paginacao } from "../../dto";
import Usuario from "../model/Usuario"

export default interface RepositorioUsuario {
    listar(page: string, tamanho: string, nome: string, cpf: string, status: string, perfil: string): Promise<Paginacao<Usuario>>;
    recuperar(id: number): Promise<Usuario | null>;
    salvar(usuario: Usuario): Promise<void>;
    excluir(id: number): Promise<void>;
    recuperarUsuarioPorEmail(email: string): Promise<Usuario | null>;
    alterarSenha(novaSenha: String, idUsuario: number): Promise<string>;
    listarUsuarioInfluencer(): Promise<Usuario[] | null>;
}