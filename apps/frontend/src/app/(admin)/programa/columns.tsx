"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { ColumnMeta, Programa } from "@portaldemilhas/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import Deleta from "@/components/shared/Deleta"
import { ReactNode } from "react"

type ColunasProps = (excluir: (id: number) => void) => ColumnDef<Programa, string | number | ReactNode>[]
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
      <div className="truncate text-slate-400">
        {row.original.descricao}
      </div>
    ),
    meta: { width: "45%" } as ColumnMeta,
  },
  {
    accessorKey: "companhia",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Companhia</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lg:w-[300px] truncate text-slate-400">
        {row.original.companhia}
      </div>
    ),
    meta: { width: "45%" } as ColumnMeta,
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
        <Link href={`/programa/cadastro/${row.original.id}`}>
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
