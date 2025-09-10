import CasoDeUso from "../../shared/CasoDeUso";
import Programa from "../model/Programa";
import RepositorioPrograma from "../provider/RepositorioPrograma";

export default class ListarTodosProgramas implements CasoDeUso<null, Programa[]> {
    constructor(private readonly repositorio: RepositorioPrograma){}

    async executar(): Promise<Programa[]> {
       return this.repositorio.listarTodos();
    }
}