import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";
import Assinatura from "../model/Assinatura"

type Entrada = {
    id: number
}

export default class RecuperarAssinatura implements CasoDeUso<Entrada, Assinatura> {
    constructor(private readonly repositorio: RepositorioAssinatura){}
    
    async executar(entrada: Entrada): Promise<Assinatura> {
        const { id } = entrada
        
        if(!id) throw new Error('Id da assinatura não informado!')
        
        const assinatura = await this.repositorio.recuperar(id);

        if(!assinatura) throw new Error('Assinatura não encontrada');
        
        return assinatura;
    }
}