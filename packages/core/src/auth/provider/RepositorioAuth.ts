export default interface RepositorioAuth {
    logar(email: string): Promise<any>
}