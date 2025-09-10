import Programa from './model/Programa'
import RepositorioPrograma from './provider/RepositorioPrograma'
import CadastrarPrograma from './service/CadastrarPrograma'
import ListarPrograma from './service/ListarPrograma'
import ListarTodosProgramas from './service/ListarTodosProgramas'
import ExcluirPrograma from './service/ExcluirPrograma'
import RecuperarPrograma from './service/RecuperarPrograma'

export type { Programa, RepositorioPrograma }
export { 
    CadastrarPrograma, ListarPrograma, ListarTodosProgramas, 
    ExcluirPrograma, RecuperarPrograma 
}