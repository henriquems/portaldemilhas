import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AssinaturaService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 */12 * * *')
  async verificarAssinaturasVencidas() {
    await this.prisma.assinatura.updateMany({
      where: {
        status: 'PAGA',
        dataVencimento: { lt: new Date() },
      },
      data: {
        status: 'VENCIDA',
      },
    });
  }
}