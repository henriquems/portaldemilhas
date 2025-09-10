"use client"
import {
  ColumnDef,
  SortingState,
  flexRender,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import { ColumnMeta, StatusUsuario, Usuario } from "@portaldemilhas/core"
import Processando from "@/components/shared/Processando"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: number
  pageSize: number
  totalCount: number
  carregando: boolean
  usuarios: Usuario[]
  listar: (filtros?: { nome?: string; descricao?: string; valorDesconto?: number; status?: string }) => void
}

export function DataTable<TData, TValue>({columns, data, page, pageSize, totalCount, carregando, usuarios, listar}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    const nome = (table.getColumn("usuario.nome")?.getFilterValue() as string) ?? ""
    const descricao = (table.getColumn("descricao")?.getFilterValue() as string) ?? ""
    const valorDesconto = (table.getColumn("valorDesconto")?.getFilterValue() as number) ?? undefined
    const status = (table.getColumn("status")?.getFilterValue() as string) ?? ""
    
    listar({
      nome: nome || undefined,
      descricao: descricao || undefined,
      valorDesconto: valorDesconto || undefined,
      status: status || undefined,
    })
  }, [columnFilters, listar, table])

  return (
    <div>
      <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-2 mb-2">
       <Select
          onValueChange={(value) =>
            table.getColumn("usuario.nome")?.setFilterValue(value === "TODOS" ? undefined : value)
          }
          value={(table.getColumn("usuario.nome")?.getFilterValue() as string) ?? "TODOS"}
        >
          <SelectTrigger className="w-full min-h-[2.5rem] 
            !text-slate-400 text-[16px] lg:text-[14px] border 
            border-gray-800 bg-gray-950">
            <SelectValue placeholder="Filtrar por influencer" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 text-white border border-gray-800">
            <SelectItem value="TODOS">Todos os Influencers</SelectItem>
            {usuarios.map((usuario) => (
              <SelectItem key={usuario.id} value={usuario.nome}
                className="hover:bg-gray-600 focus:bg-gray-600 text-slate-400">
                {usuario.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
       
       <Select
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "TODOS" ? undefined : value)
          }
          value={(table.getColumn("status")?.getFilterValue() as string) ?? "TODOS"}
        >
          <SelectTrigger className="w-full min-h-[2.5rem] 
            !text-slate-400 text-[16px] lg:text-[14px] border 
            border-gray-800 bg-gray-950">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 text-white border border-gray-800">
            <SelectItem value="TODOS" className="text-slate-400">Todos os status</SelectItem>
            {Object.entries(StatusUsuario).map(([key, value]) => (
              <SelectItem key={key} value={key}
                className="hover:bg-gray-600 focus:bg-gray-600 text-slate-400"
              >
                {value.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Filtrar por descrição"
          value={(table.getColumn("descricao")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("descricao")?.setFilterValue(event.target.value)
          }
          className="max-w h-10 text-slate-300 bg-gray-950 border-gray-800 !placeholder-slate-300"
        />

        <Input
          placeholder="Filtrar por valor desconto"
          value={(table.getColumn("valorDesconto")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("valorDesconto")?.setFilterValue(event.target.value)
          }
          className="max-w h-10 text-slate-300 bg-gray-950 border-gray-800 !placeholder-slate-300"
        />
      </div>
      <div className="rounded-md border border-gray-800 !placeholder-slate-300 overflow-x-auto">
        <Table className="rounded-t-md overflow-hidden">
          <TableHeader className="text-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-gray-950 transition-colors">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-gray-950 border-b border-gray-800 text-slate-300"
                    style={{ width: (header.column.columnDef.meta as ColumnMeta)?.width }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
          {carregando ? (
            <TableRow className="bg-transparent hover:bg-transparent border-none">
              <TableCell
                colSpan={columns.length}
                className="h-36 text-center bg-transparent border-none text-slate-300"
              >
                <Processando />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-gray-800 transition-colors"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border-t border-gray-800 text-slate-300 truncate"
                    style={{ width: (cell.column.columnDef.meta as ColumnMeta)?.width }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-14 text-center text-slate-400 hover:bg-slate-900">
                Nenhum cupom cadastrado no sistema!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-3">
        <PaginationWithLinks page={page} pageSize={pageSize} totalCount={totalCount} />
      </div>
    </div>
  )
}
