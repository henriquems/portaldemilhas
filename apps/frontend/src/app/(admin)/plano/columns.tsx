"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { ColumnMeta, Plano, formatCurrencyBRL } from "@portaldemilhas/core"
import { IconEdit } from "@tabler/icons-react"
import { ReactNode } from "react"
import Link from "next/link"
import Deleta from "@/components/shared/Deleta"

type ColunasProps = (excluir: (id: number) => void) => ColumnDef<Plano, string | number | ReactNode>[]

export const columns: ColunasProps = (excluir) => [
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        <span className="text-slate-400 font-semibold pl-2">Descrição</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="truncate text-slate-400 pl-5">
        {row.original.descricao}
      </div>
    ),
     meta: { width: "70%" } as ColumnMeta,
  },
  {
    accessorKey: "dias",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Dias</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center truncate text-slate-400">
        {row.original.dias}
      </div>
    ),
     meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "valor",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Valor</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center truncate text-slate-400">
        { formatCurrencyBRL(row.original.valor) }
      </div>
    ),
     meta: { width: "10%" } as ColumnMeta,
  },
  {
    id: "editar",
    header: () => (
      <div className="flex justify-center text-slate-400 font-semibold">
        Editar
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link href={`/plano/cadastro/${row.original.id}`}>
          <IconEdit
            width={28}
            height={28}
            stroke={2}
            className="text-slate-400 hover:text-slate-400"
          />
        </Link>
      </div>
    ),
     meta: { width: "5%" } as ColumnMeta,
  },
  {
    id: "excluir",
   header: () => (
      <div className="flex justify-center text-slate-400 font-semibold">
        Excluir
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Deleta id={row.original.id!}
          descricao={row.original.descricao}
          excluir={excluir}
        />
      </div>
    ),
     meta: { width: "5%" } as ColumnMeta,
  },
]
