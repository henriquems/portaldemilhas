import { Injectable } from '@nestjs/common';
import { ProvedorEmail } from '@portaldemilhas/core';
import { Resend } from 'resend';

@Injectable()
export class EmailService implements ProvedorEmail {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async enviarEmail(destinatario: string, assunto: string, corpo: string) {
    await this.resend.emails.send({
      from: 'noreply@portaldemilhas.com.br',
      to: destinatario,
      subject: 'Portal de Milhas',
      html: corpo,
    });
  }
}
