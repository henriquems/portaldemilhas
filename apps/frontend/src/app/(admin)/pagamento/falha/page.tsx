import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import { IconChevronLeft, IconExclamationCircle, IconReceiptDollar } from "@tabler/icons-react";
import Link from "next/link";

export default function FalhaPagamento() {
    return (
        <div className="w-full flex justify-center px-4">
            <div className="w-full lg:w-[50%]">
                <TituloPagina icone={<IconReceiptDollar />} descricao="Pagamento" />

                <Card icon={<IconExclamationCircle />} titulo="Falha">
                    <div className="flex flex-col gap-5 p-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-lg text-orange-500">Falha ao tentar realizar o pagamento!</span>
                            <span className="text-slate-300">Por favor, tente novamente!</span>
                        </div>

                        <div className="flex gap-4 mt-5">
                            <Link href="/assinatura" className="botao secundario w-full">
                                <IconChevronLeft width={18} height={18} />
                                <span>Voltar</span>
                            </Link>
                       </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}