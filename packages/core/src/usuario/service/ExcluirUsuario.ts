import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioUsuario from "../provider/RepositorioUsuario";

type Entrada = {
    id: number
}

export default class ExcluirUsuario implements CasoDeUso<Entrada, void> {
    constructor(private readonly repositorio: RepositorioUsuario){}
    
    async executar(entrada: Entrada): Promise<void> {
        const { id } = entrada
        if(!id) throw new Error('Usuário não encontrado!')
        await this.repositorio.excluir(id)
    }
}