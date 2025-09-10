export abstract class ProvedorEmail {
  abstract enviarEmail(destinatario: string, assunto: string, corpo: string): Promise<void>;
}