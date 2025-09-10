import { Injectable } from '@nestjs/common';
import { RepositorioAnuncio, Anuncio, StatusAnuncio, StatusUsuario, StatusUsuarioTipo, StatusAnuncioTipo, TipoAnuncioTipo } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AnuncioPrisma implements RepositorioAnuncio {
    constructor(private readonly prisma: PrismaService){}

    async listar(
        page: string,
        pageSize: string,
        programaId?: string,
        tipo?: string,
        quantidadeMinima?: string,
    ): Promise<{ total: number, itens: Anuncio[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const usuariosComAnuncios = await this.prisma.usuario.findMany({
            include: {
            perfis: true,
            assinaturas: {
                orderBy: { data: 'desc' },
                take: 1, 
            },
            anuncios: {
                where: {
                ...(programaId ? { programaId: Number(programaId) } : {}),
                ...(tipo ? { tipo } : {}),
                ...(quantidadeMinima ? { quantidadeMilhas: { gte: Number(quantidadeMinima) } } : {}),
                },
                orderBy: { id: 'desc' },
                include: { programa: true },
            },
            },
        });

        const usuariosComAssinaturaPaga = usuariosComAnuncios.filter(u =>
            u.assinaturas.length > 0 && u.assinaturas[0].status === 'PAGA'
        );

        const anunciosFiltrados = usuariosComAssinaturaPaga.flatMap(u =>
            u.anuncios.map(a => ({
            ...a,
            usuario: { ...u, assinaturas: undefined },
            }))
        );

        const total = anunciosFiltrados.length;

        const anunciosPaginados = anunciosFiltrados.slice((pag - 1) * tam, (pag - 1) * tam + tam);

        const itens = anunciosPaginados.map(anuncio => ({
            ...anuncio,
            tipo: anuncio.tipo as TipoAnuncioTipo,
            status: anuncio.status as StatusAnuncioTipo,
            valor: Number(anuncio.valor),
            usuario: { ...anuncio.usuario, status: anuncio.usuario.status as StatusUsuarioTipo },
            programa: { ...anuncio.programa },
        }));

        return { total, itens };
    }

    async listarPorUsuario(page: string, pageSize: string, usuario?: { id: number, perfis: string[] }, programaId?: string): Promise<{ total: number, itens: Anuncio[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const isAdministrador = usuario?.perfis.includes('ADMINISTRADOR');

        const where: any = {};

        if (!isAdministrador) {
            where.usuarioId = usuario?.id;
        }

        if (programaId) {
            where.programaId = Number(programaId);
        }

        const [total, data] = await this.prisma.$transaction([
            this.prisma.anuncio.count({
                where
            }),
            this.prisma.anuncio.findMany({
                where,
                skip: (pag - 1) * tam,
                take: tam,
                include: {
                    usuario: {
                        include: {
                            perfis: true,
                        },
                    },
                    programa: true,
                },
                orderBy: {
                    id: "desc"
                }
            })
        ]);

        return {
            total,
            itens: data.map(anuncio => ({
                ...anuncio,
                tipo: anuncio.tipo as TipoAnuncioTipo,
                status: anuncio.status as StatusAnuncioTipo,
                valor: Number(anuncio.valor),
                usuario: {
                    ...anuncio.usuario,
                    status: anuncio.usuario.status as StatusUsuarioTipo
                },
                programa: {
                    ...anuncio.programa,
                },
            })),
        };
    }

    async listarPago(page: string, pageSize: string, programaId?: string): Promise<{ total: number, itens: Anuncio[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const usuariosComAnuncios = await this.prisma.usuario.findMany({
            where: {
                anuncios: programaId ? { some: { programaId: Number(programaId) } } : undefined,
            },
            include: {
                perfis: true,
                assinaturas: {
                    orderBy: { data: 'desc' }, 
                    take: 1,
                },
                anuncios: {
                    where: programaId ? { programaId: Number(programaId) } : undefined,
                    orderBy: { id: 'desc' },
                    include: {
                        programa: true,
                    }
                }
            }
        });

        const usuariosComAssinaturaPaga = usuariosComAnuncios.filter(u =>
            u.assinaturas.length > 0 && u.assinaturas[0].status === 'PAGA'
        );

        const anunciosFiltrados = usuariosComAssinaturaPaga.flatMap(u => 
            u.anuncios.map(a => ({
                ...a,
                usuario: {
                    ...u,
                    assinaturas: undefined,
                }
            }))
        );

        const total = anunciosFiltrados.length;
        const inicio = (pag - 1) * tam;
        const fim = inicio + tam;
        const anunciosPaginados = anunciosFiltrados.slice(inicio, fim);

        const itens = anunciosPaginados.map(anuncio => ({
            ...anuncio,
            tipo: anuncio.tipo as TipoAnuncioTipo,
            status: anuncio.status as StatusAnuncioTipo,
            valor: Number(anuncio.valor),
            usuario: {
                ...anuncio.usuario,
                status: anuncio.usuario.status as StatusUsuarioTipo
            },
            programa: {
                ...anuncio.programa,
            },
        }));

        return {
            total,
            itens,
        };
    }

    async listarDestaques(): Promise<Anuncio[]> {
        const usuariosComAnuncios = await this.prisma.usuario.findMany({
            include: {
                perfis: true,
                assinaturas: {
                    orderBy: { data: 'desc' }, 
                    take: 1,
                },
                anuncios: {
                    orderBy: { id: 'desc' },
                    include: { programa: true },
                }
            }
        });

        const usuariosComAssinaturaPaga = usuariosComAnuncios.filter(u =>
            u.assinaturas.length > 0 && u.assinaturas[0].status === 'PAGA'
        );

        const anunciosFiltrados = usuariosComAssinaturaPaga.flatMap(u =>
            u.anuncios.map(a => ({
                ...a,
                usuario: { ...u, assinaturas: undefined }
            }))
        );

        const itens = anunciosFiltrados.map(anuncio => ({
            ...anuncio,
            tipo: anuncio.tipo as TipoAnuncioTipo,
            status: anuncio.status as StatusAnuncioTipo,
            valor: Number(anuncio.valor),
            usuario: { ...anuncio.usuario, status: anuncio.usuario.status as StatusUsuarioTipo },
            programa: { ...anuncio.programa },
        }));

        return itens;
    }

    async recuperar(valor: number): Promise<Anuncio | null> {
        const id = Number(valor)

        const anuncio = await this.prisma.anuncio.findUnique({
            where: { id },
            include: {
                usuario: true,
                programa: true,
            },
        })

        if (!anuncio) return null;

        return {
            ...anuncio,
            tipo: anuncio.tipo as TipoAnuncioTipo,
            status: anuncio.status as StatusAnuncioTipo,
            valor: anuncio.valor != null ? Number(anuncio.valor.toFixed(2)) : null,
            usuario: {
                ...anuncio.usuario,
                status: anuncio.usuario.status as StatusUsuarioTipo,
            },
            programa: anuncio.programa
        };
    }

    async excluir(valor: number): Promise<void> {
        const id = Number(valor)

        await this.prisma.anuncio.delete({
          where: { id },
        });
    }

    async salvar(anuncio: Anuncio): Promise<void> {
        if (!anuncio.id || anuncio.id === 0) {
            await this.prisma.anuncio.create({
                data: {
                    usuario: { connect: { id: anuncio.usuario.id } },
                    programa: { connect: { id: anuncio.programa.id } },
                    tipo: anuncio.tipo as TipoAnuncioTipo,
                    quantidadeMilhas: anuncio.quantidadeMilhas,
                    valor: anuncio.valor,
                    status: anuncio.status as StatusAnuncioTipo,
                    data: anuncio.data,
                }
            });
        } else {
            await this.prisma.anuncio.update({
                where: { id: anuncio.id },
                data: {
                    usuario: { connect: { id: anuncio.usuario.id } },
                    programa: { connect: { id: anuncio.programa.id } },
                    tipo: anuncio.tipo as TipoAnuncioTipo,
                    quantidadeMilhas: anuncio.quantidadeMilhas,
                    valor: anuncio.valor,
                    status: anuncio.status as StatusAnuncioTipo,
                    data: anuncio.data,
                }
            });
        }
    }

}
