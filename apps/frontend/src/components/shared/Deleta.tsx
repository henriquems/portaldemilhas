import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IconTrash } from "@tabler/icons-react"

interface Props {
  id: number
  excluir: (id: number) => void
  children?: React.ReactNode
  descricao: string
}

export default function Deleta({ id, excluir, children, descricao }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {
          children ? (
            children
          ) : (
            <button className="text-slate-400 
              hover:text-slate-300 cursor-pointer" 
              title="Excluir">
              <IconTrash width={28} height={28} />
            </button>
          )
        }
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-800 border border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Excluir { descricao }?</AlertDialogTitle>
          <AlertDialogDescription asChild className="mt-2 mb-2">
            <div className="text-[16px] text-orange-500">
              Tem certeza que deseja excluir { descricao }?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-900 border-slate-900 h-10 
            hover:bg-slate-950 hover:border-slate-950 cursor-pointer
            text-white hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <Button variant="destructive" onClick={() => excluir(id)}
              className="h-9.5 hover:bg-red-800 text-white font-bold cursor-pointer">
            Excluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
