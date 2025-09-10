import { Injectable } from '@nestjs/common';
import { Cupom, CupomNaoEncontrado, RepositorioCupom, StatusCupomTipo, StatusUsuarioTipo } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CupomPrisma implements RepositorioCupom {
    constructor(private readonly prisma: PrismaService){}

    async listar(
        page: string,
        pageSize: string,
        nome?: string,
        descricao?: string,
        valoDesconto?: number,
        status?: string
    ): Promise<{ total: number; itens: Cupom[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const where: any = {};

        if (nome) {
            where.nome = { contains: nome, mode: "insensitive" };
        }

        if (descricao) {
            where.descricao = { contains: descricao };
        }

        if (valoDesconto) {
            where.valoDesconto = valoDesconto;
        }

        if (status) {
            where.status = status as StatusUsuarioTipo;
        }

        const [total, data] = await this.prisma.$transaction([
            this.prisma.cupom.count({ where }),
            this.prisma.cupom.findMany({
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
            },
            orderBy: { id: "asc" },
            }),
        ]);

        const cupons: Cupom[] = data.map((cupom) => ({
            ...cupom,
            status: cupom.status as StatusCupomTipo,
            valorDesconto: Number(cupom.valorDesconto),
            usuario: {
                ...cupom.usuario,
                status: cupom.usuario.status as StatusUsuarioTipo,
            },
        }));

        return { total, itens: cupons };
    }

    async verificarCupom(descricao: string): Promise<Cupom | null> {
        const cupom = await this.prisma.cupom.findFirst({
            where: { 
                descricao: {
                    equals: descricao,
                    mode: 'insensitive', 
                },
                status: 'ATIVO' },
            include: {
                usuario: {
                    select: { 
                        id: true, nome: true, email: true, senha: true, 
                        cpf: true, telefone: true, status: true 
                    }
                },
            },
        })

        if (!cupom) throw new CupomNaoEncontrado();

        return {
            ...cupom,
            status: cupom.status as StatusCupomTipo,
            valorDesconto: Number(cupom.valorDesconto),
            usuario: {
                ...cupom.usuario,
                status: cupom.usuario.status as StatusUsuarioTipo,
            },
        };
    }

    async recuperar(valor: number): Promise<Cupom | null> {
        const id = Number(valor)

        const cupom = await this.prisma.cupom.findUnique({
            where: { id },
            include: {
                usuario: {
                    select: { 
                        id: true, nome: true, email: true, senha: true, 
                        cpf: true, telefone: true, status: true 
                    }
                },
            },
        })

        if (!cupom) return null;

        return {
            ...cupom,
            status: cupom.status as StatusCupomTipo,
            valorDesconto: Number(cupom.valorDesconto),
            usuario: {
                ...cupom.usuario,
                status: cupom.usuario.status as StatusUsuarioTipo,
            },
        };
    }

    async excluir(valor: number): Promise<void> {
        const id = Number(valor)

        await this.prisma.cupom.delete({
          where: { id },
        });
    }

    async salvar(cupom: Cupom): Promise<void> {
        if (cupom.id) {
            await this.prisma.cupom.upsert({
                where: {
                    id: cupom.id,
                },
                create: {
                    usuario: { connect: { id: cupom.usuario.id } },
                    descricao: cupom.descricao,
                    valorDesconto: Number(cupom.valorDesconto),
                    status: cupom.status
                },
                update: {
                    usuario: { connect: { id: cupom.usuario.id } },
                    descricao: cupom.descricao,
                    valorDesconto: Number(cupom.valorDesconto),
                    status: cupom.status
                },
            });
        } else {
            await this.prisma.cupom.create({
                data: {
                    usuario: { connect: { id: cupom.usuario.id } },
                    descricao: cupom.descricao,
                    valorDesconto: Number(cupom.valorDesconto),
                    status: cupom.status
                },
            });
        }
    }
}
