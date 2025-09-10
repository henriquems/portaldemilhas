export function mascararEmail(email: string): string {
    const [usuario, dominio] = email.split('@');
    if (!usuario || usuario.length < 3) return email;
    
    const parteVisivel = usuario.slice(0, 4);
    return `${parteVisivel}*****@${dominio}`;
}