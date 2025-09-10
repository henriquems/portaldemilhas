import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";
import Assinatura from "../model/Assinatura"

type Entrada = {
    usuarioId: number
}

export default class RecuperarUltimaAssinaturaDoUsuario implements CasoDeUso<Entrada, Assinatura> {
    constructor(private readonly repositorio: RepositorioAssinatura){}
    
    async executar(entrada: Entrada): Promise<Assinatura> {
        const { usuarioId } = entrada
        if(!usuarioId) throw new Error('Id do usuário não informado!')
        
        const assinatura = await this.repositorio.recuperarUltimaAssinaturaDoUsuario(usuarioId);
        if(!assinatura) throw new Error('Assinatura não encontrada');
        
        return assinatura;
    }
}