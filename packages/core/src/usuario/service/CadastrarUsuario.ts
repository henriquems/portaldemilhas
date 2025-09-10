import CasoDeUso from "../../shared/CasoDeUso";
import Usuario from "../model/Usuario";
import ProvedorCriptografia from "../provider/ProvedorCriptografia";
import RepositorioUsuario from "../provider/RepositorioUsuario";

export default class CadastrarUsuario implements CasoDeUso<Usuario, void> {
    constructor(
        private readonly repositorio: RepositorioUsuario,
        private readonly cripto: ProvedorCriptografia
    ) {}

    async executar(usuario: Usuario): Promise<void> {
        if (!usuario.id) {
            if (!usuario.senha || usuario.senha.trim() === '') {
                throw new Error('Senha é obrigatória');
            }

            const senhaCriptografada = await this.cripto.criptografar(usuario.senha);

            await this.repositorio.salvar({
                ...usuario,
                senha: senhaCriptografada,
            });
        } else {
            let senhaCriptografada: string | undefined = undefined;

            if (usuario.senha && usuario.senha.trim() !== '') {
                senhaCriptografada = await this.cripto.criptografar(usuario.senha);
            }

            await this.repositorio.salvar({
                ...usuario,
                ...(senhaCriptografada ? { senha: senhaCriptografada } : {})
            });
        }
    }
}
