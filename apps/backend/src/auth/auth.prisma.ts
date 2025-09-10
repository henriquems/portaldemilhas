import { Injectable } from '@nestjs/common';
import { RepositorioAuth, StatusUsuarioTipo, Usuario, StatusAssinaturaTipo, PagamentoInfluencer } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AuthPrisma implements RepositorioAuth {
  constructor(private readonly prisma: PrismaService) {}

  async logar(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email,
        status: 'ATIVO',
      },
      include: {
        perfis: {
          select: { id: true, nome: true, descricao: true },
        },
        assinaturas: {
          orderBy: { data: 'desc' },
          take: 1,
          select: {
            id: true, status: true, data: true, valor: true, dataPagamento: true, pagamentoInfluencer: true,
            usuario: { select: { id: true, nome: true, email: true, cpf: true, telefone: true, status: true}},
            plano: { select: { id: true, descricao: true, dias: true, valor: true},
            },
          },
        },
      },
    });

    if (!usuario) return null;

    const assinaturasCorrigidas = (usuario.assinaturas || []).map((assinatura) => ({
      ...assinatura,
      status: assinatura.status as StatusAssinaturaTipo,
      pagamentoInfluencer: assinatura.pagamentoInfluencer as PagamentoInfluencer,
      valor: (assinatura.valor as any).toNumber?.() ?? Number(assinatura.valor),
      dataPagamento: assinatura.dataPagamento,
      usuario: {
        ...assinatura.usuario,
        status: assinatura.usuario.status as StatusUsuarioTipo,
      },
      plano: {
        ...assinatura.plano,
        valor: (assinatura.plano.valor as any).toNumber?.() ?? Number(assinatura.plano.valor),
      },
    }));

    return {
      ...usuario,
      status: usuario.status as StatusUsuarioTipo,
      assinaturas: assinaturasCorrigidas,
    };
  }
}
