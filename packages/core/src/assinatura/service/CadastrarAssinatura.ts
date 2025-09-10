import CasoDeUso from "../../shared/CasoDeUso";
import Assinatura from "../model/Assinatura";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";

export default class CadastrarAssinatura implements CasoDeUso<Assinatura, Assinatura> {
    constructor(
        private readonly repositorio: RepositorioAssinatura){}

    async executar(assinatura: Assinatura): Promise<Assinatura> {
        const existente = await this.repositorio.recuperarUltimaAssinaturaDoUsuario(assinatura.usuario.id);

        if (existente && existente.status === "AGUARDANDO") {
            return existente;
        }

        return await this.repositorio.salvar(assinatura);
    }
}