import Usuario from "../model/Usuario";
import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioUsuario from "../provider/RepositorioUsuario";

type Entrada = {
    id: number
}

export default class RecuperarUsuario implements CasoDeUso<Entrada, Usuario> {
    constructor(private readonly repositorio: RepositorioUsuario){}
    
    async executar(entrada: Entrada): Promise<Usuario> {
        const { id } = entrada
        
        if(!id) throw new Error('Id Usuário não informado!')
        
        const usuario = await this.repositorio.recuperar(id);

        if(!usuario) throw new Error('Usuário não encontrado');
        
         return usuario;
    }
}