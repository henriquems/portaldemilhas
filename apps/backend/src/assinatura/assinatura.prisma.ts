import { Injectable } from '@nestjs/common';
import { Assinatura, PagamentoInfluencer, RepositorioAssinatura, StatusAssinaturaTipo, StatusUsuarioTipo, Usuario } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AssinaturaPrisma implements RepositorioAssinatura {
    constructor(private readonly prisma: PrismaService){}

    async listar(page: string, pageSize: string, planoId?: string): Promise<{ total: number, itens: Assinatura[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const where: any = {};
        if (planoId) {
            where.planoId = Number(planoId);
        }

        const [total, data] = await this.prisma.$transaction([
            this.prisma.assinatura.count({ where }),
            this.prisma.assinatura.findMany({
                where,
                skip: (pag - 1) * tam,
                take: tam,
                include: {
                    usuario: {
                        select: { 
                            id: true, nome: true, email: true, senha: true, 
                            cpf: true, telefone: true, status: true 
                        }
                    },
                    plano: {
                        select: { id: true, descricao: true, dias: true, valor: true }
                    }
                },
                orderBy: {
                    id: "desc"
                }
            })
        ]);

        const assinaturas: Assinatura[] = data.map(assinatura => ({
            ...assinatura,
            status: assinatura.status as StatusAssinaturaTipo,
            pagamentoInfluencer: assinatura.pagamentoInfluencer as PagamentoInfluencer,
            valor: Number(assinatura.valor),
            valorPago: Number(assinatura.valorPago),
            usuario: {
                ...assinatura.usuario,
                status: assinatura.usuario.status as StatusUsuarioTipo,
            },
            plano: {
                ...assinatura.plano,
                valor: Number(assinatura.plano.valor),
            },
        }));

        return { total, itens: assinaturas };
    }

    async listarPorUsuario(page: string, pageSize: string, usuario?: { id: number, perfis: string[] }, planoId?: string): Promise<{ total: number; itens: Assinatura[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const isAdministrador = usuario?.perfis.includes("ADMINISTRADOR");

        const where: any = {};

        if (!isAdministrador) {
            where.usuarioId = usuario?.id;
        }

        if (planoId) {
            where.planoId = Number(planoId);
        }

        const [total, data] = await this.prisma.$transaction([
            this.prisma.assinatura.count({
            where,
            }),
            this.prisma.assinatura.findMany({
            where,
            skip: (pag - 1) * tam,
            take: tam,
            include: {
                usuario: {
                include: {
                    perfis: true,
                },
                },
                plano: true,
            },
            orderBy: {
                id: "desc",
            },
            }),
        ]);

        return {
            total,
            itens: data.map((assinatura) => ({
            ...assinatura,
            status: assinatura.status as StatusAssinaturaTipo,
            pagamentoInfluencer: assinatura.pagamentoInfluencer as PagamentoInfluencer,
            valor: Number(assinatura.valor),
            valorPago: Number(assinatura.valorPago),
            usuario: {
                ...assinatura.usuario,
                status: assinatura.usuario.status as StatusUsuarioTipo,
            },
            plano: {
                ...assinatura.plano,
                valor: Number(assinatura.plano.valor),
            },
            })),
        };
    }

    async recuperar(valor: number): Promise<Assinatura | null> {
        const id = Number(valor);

        const assinatura = await this.prisma.assinatura.findUnique({
            where: { id },
            include: {
                usuario: {
                    select: {
                        id: true, nome: true, email: true, senha: true, 
                        cpf: true, telefone: true, status: true,
                    },
                },
                plano: {
                    select: {
                        id: true, descricao: true, dias: true, valor: true,
                    },
                },
            },
        });

        if (!assinatura) return null;

        return {
            ...assinatura,
            status: assinatura.status as StatusAssinaturaTipo,
            pagamentoInfluencer: assinatura.pagamentoInfluencer as PagamentoInfluencer,
            valor: Number(assinatura.valor),
            valorPago: Number(assinatura.valorPago),
            dataPagamento: assinatura.dataPagamento ?? null,
            dataVencimento: assinatura.dataVencimento ?? null,
            usuario: {
                ...assinatura.usuario, 
                status: assinatura.usuario.status as StatusUsuarioTipo,
            },
            plano: {
                ...assinatura.plano, 
                valor: Number(assinatura.plano.valor),
            },
        };
    }

    async recuperarUltimaAssinaturaDoUsuario(usuarioId: number): Promise<Assinatura | null> {
        const assinatura = await this.prisma.assinatura.findFirst({
            where: {
                usuarioId: usuarioId,
            },
            orderBy: {
                id: 'desc', 
            },
            include: {
                usuario: {
                    select: {
                        id: true, nome: true, email: true, senha: true,
                        cpf: true, telefone: true, status: true,
                    },
                },
                plano: {
                    select: {
                        id: true, descricao: true, dias: true, valor: true,
                    },
                },
            },
        });

        if (!assinatura) return null;

        return {
            ...assinatura,
            status: assinatura.status as StatusAssinaturaTipo,
            pagamentoInfluencer: assinatura.pagamentoInfluencer as PagamentoInfluencer,
            valor: Number(assinatura.valor),
            valorPago: Number(assinatura.valorPago),
            dataPagamento: assinatura.dataPagamento ?? null,
            dataVencimento: assinatura.dataVencimento ?? null,
            usuario: {
                ...assinatura.usuario,
                status: assinatura.usuario.status as StatusUsuarioTipo,
            },
            plano: {
                ...assinatura.plano,
                valor: Number(assinatura.plano.valor),
            },
        };
    }

    async excluir(valor: number): Promise<void> {
        const id = Number(valor)

        await this.prisma.assinatura.delete({
          where: { id },
        });
    }

    async alterarStatus(assinatura: Assinatura, status: string): Promise<void> {
        const data: any = { status };

        if (status === 'PAGA') {
            const dataAtual = new Date();
            const dias = assinatura.plano?.dias ?? 0;

            data.dataPagamento = dataAtual;
            data.dataVencimento = new Date(dataAtual.getTime() + dias * 24 * 60 * 60 * 1000);
        }

        await this.prisma.assinatura.update({
            where: { id: assinatura.id },
            data,
        });
    }

    async atualizarValorPago(id: number, valorPago: number): Promise<void> {
        await this.prisma.assinatura.update({
            where: { id },
            data: { valorPago },
        });
    }

    async aplicarCupom(assinaturaId: number, cupomId: number): Promise<void> {
        await this.prisma.assinatura.update({
            where: { id: assinaturaId },
            data: { cupomId },
        });
    }
    
    async recuperarAssinaturaQueContemCupomDoUsuario(
        page: string,
        pageSize: string,
        usuario?: { id: number, perfis: string[] }
    ): Promise<{ total: number; itens: Assinatura[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const isAdministrador = usuario?.perfis.includes("ADMINISTRADOR");

        const where: any = {
            cupomId: { not: null }, 
        };

        if (usuario && !isAdministrador) {
            where.cupom = {
            usuarioId: Number(usuario.id),
            };
        }

        const [total, data] = await this.prisma.$transaction([
            this.prisma.assinatura.count({ where }),
            this.prisma.assinatura.findMany({
            where,
            skip: (pag - 1) * tam,
            take: tam,
            include: {
                usuario: {
                select: { id: true, nome: true, email: true, senha: true, cpf: true, telefone: true, status: true },
                },
                plano: {
                select: { id: true, descricao: true, dias: true, valor: true },
                },
                cupom: {
                include: {
                    usuario: {
                    select: { id: true, nome: true, email: true, cpf: true, telefone: true, status: true },
                    },
                },
                },
            },
            orderBy: { id: 'desc' },
            }),
        ]);

        const assinaturas: Assinatura[] = data.map(a => ({
                ...a,
                status: a.status as StatusAssinaturaTipo,
                pagamentoInfluencer: a.pagamentoInfluencer as PagamentoInfluencer,
                valor: Number(a.valor),
                valorPago: Number(a.valorPago),
                usuario: {
                ...a.usuario,
                status: a.usuario.status as StatusUsuarioTipo,
            },
            plano: {
                ...a.plano,
                valor: Number(a.plano.valor),
            },
            cupom: a.cupom
            ? {
                ...a.cupom,
                valorDesconto: Number(a.cupom.valorDesconto),
                status: a.cupom.status as StatusUsuarioTipo,
                pagamentoInfluencer: a.pagamentoInfluencer as PagamentoInfluencer,
                usuario: {
                    ...a.cupom.usuario,
                    status: a.cupom.usuario.status as StatusUsuarioTipo,
                },
                }
            : null,
        }));

        return { total, itens: assinaturas };
    }

    async alterarPagamentoInfluencer(id: number, pagamentoInfluencer: string): Promise<void> {
        await this.prisma.assinatura.update({
            where: { id },
            data: {
                pagamentoInfluencer
            }
        });
    }

    async somarValorPagoComCupom(usuario: { id: number; perfis: string[] }): Promise<number> {
        const isAdministrador = usuario?.perfis.includes("ADMINISTRADOR");

        const result = await this.prisma.assinatura.aggregate({
            _sum: {
                valorPago: true,
            },
            where: {
                cupomId: { not: null },
                pagamentoInfluencer: 'PAGO',
                ...(isAdministrador ? {} : {
                    cupom: {
                        usuarioId: usuario.id,
                    },
                }),
            },
        });

        return Number(result._sum.valorPago?.toFixed(2) ?? 0);
    }

    async somarValorAPagarComCupom(usuario: { id: number; perfis: string[] }): Promise<number> {
        const isAdministrador = usuario?.perfis.includes("ADMINISTRADOR");

        const result = await this.prisma.assinatura.aggregate({
            _sum: {
                valorPago: true,
            },
            where: {
                cupomId: { not: null },
                pagamentoInfluencer: 'AGUARDANDO',
                ...(isAdministrador ? {} : {
                    cupom: {
                        usuarioId: usuario.id,
                    },
                }),
            },
        });

        return Number(result._sum.valorPago?.toFixed(2) ?? 0);
    }

    async recuperarTotalAssinaturaComCupom(usuario: { id: number; perfis: string[] }): Promise<number> {
        const isAdministrador = usuario?.perfis.includes("ADMINISTRADOR");

        return this.prisma.assinatura.count({
            where: {
                cupomId: {
                    not: null,
                },
                ...(isAdministrador ? {} : { cupom: { usuarioId: usuario.id } }),
            },
        });
    }

    async recuperarTotalAssinaturaComCupomPago(usuario: { id: number; perfis: string[] }): Promise<number> {
        const isAdministrador = usuario?.perfis.includes("ADMINISTRADOR");

        return this.prisma.assinatura.count({
            where: {
                status: 'PAGA',
                cupomId: {
                    not: null,
                },
                ...(isAdministrador ? {} : { cupom: { usuarioId: usuario.id } }),
            },
        });
    }

    async salvar(assinatura: Assinatura): Promise<Assinatura> {
        let entidade: any;

        if (assinatura.id) {
            entidade = await this.prisma.assinatura.upsert({
            where: { id: assinatura.id },
            create: {
                usuario: { connect: { id: assinatura.usuario.id } },
                plano: { connect: { id: assinatura.plano.id } },
                status: assinatura.status,
                valor: assinatura.plano.valor,
                data: assinatura.data,
            },
            update: {
                usuario: { connect: { id: assinatura.usuario.id } },
                plano: { connect: { id: assinatura.plano.id } },
                status: assinatura.status,
                valor: assinatura.valor,
                valorPago: assinatura.valorPago,
                data: assinatura.data,
                dataPagamento: assinatura.dataPagamento,
                dataVencimento: assinatura.dataVencimento
            },
            include: {
                usuario: true,
                plano: true,
            },
            });
        } else {
            entidade = await this.prisma.assinatura.create({
                data: {
                    usuario: { connect: { id: assinatura.usuario.id } },
                    plano: { connect: { id: assinatura.plano.id } },
                    status: assinatura.status,
                    valor: assinatura.plano.valor,
                    data: assinatura.data,
                },
                include: {
                    usuario: true,
                    plano: true,
                },
            });
        }

        return {
            ...entidade,
            status: entidade.status as StatusAssinaturaTipo,
            valor: Number(entidade.valor),
            dataPagamento: entidade.dataPagamento ?? null,
            dataVencimento: entidade.dataVencimento ?? null,
            usuario: {
            ...entidade.usuario,
            status: entidade.usuario.status as StatusUsuarioTipo,
            },
            plano: {
            ...entidade.plano,
            valor: Number(entidade.plano.valor),
            },
        };
    }

}
