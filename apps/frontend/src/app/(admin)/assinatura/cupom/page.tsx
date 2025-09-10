'use client'
import { IconCalendarDollar, IconDatabaseDollar, IconReceiptDollar } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";
import { formatCurrencyBRL } from "@portaldemilhas/core";
import useAssinatura from "@/data/hooks/useAssinatura";
import TituloPagina from "@/components/shared/TituloPagina";
import Card from "@/components/shared/Card";
import CardRelatorio from "@/components/shared/CardRelatorio";

export default function MeusCupons() {
    const { 
        assinaturas, page, pageSize, total, carregando, 
        alterarPagamentoInfluencer, isAdministrador, 
        recuperarTotalAssinaturaComCupom,
        recuperarTotalAssinaturaComCupomPago,
        somarValorPagoComCupom,
        somarValorAPagarComCupom,
    } = useAssinatura();
    
    const [totalAssinaturaComCupom, setTotalAssinaturaComCupom] = useState<number>(0);
    const [totalAssinaturaComCupomPago, setTotalAssinaturaComCupomPago] = useState<number>(0);
    const [valorPagoComCupom, setValorPagoComCupom] = useState<number>(0);
    const [valorAPagarComCupom, setValorAPagarComCupom] = useState<number>(0);

    const carregarTotais = useCallback(async () => {
        try {
            const totalComCupom = await recuperarTotalAssinaturaComCupom();
            setTotalAssinaturaComCupom(totalComCupom);

            const totalComCupomPago = await recuperarTotalAssinaturaComCupomPago();
            setTotalAssinaturaComCupomPago(totalComCupomPago);

            const somatorioValoresPago = (await somarValorPagoComCupom()) / 2;
            setValorPagoComCupom(somatorioValoresPago);

            const somatorioValoresAPagar = (await somarValorAPagarComCupom()) / 2;
            setValorAPagarComCupom(somatorioValoresAPagar);
        } catch (error) {
            console.error("Erro ao carregar totais:", error);
        }
    }, [
        recuperarTotalAssinaturaComCupom,
        recuperarTotalAssinaturaComCupomPago,
        somarValorPagoComCupom,
        somarValorAPagarComCupom
    ]);

    useEffect(() => {
        carregarTotais();
    }, [carregarTotais]);

    return (
        <div>
            <TituloPagina 
                icone={<IconReceiptDollar width={20} height={20} />} 
                descricao="Meus Cupons"
                quantidadeRegistros={total}
            />

            <Card titulo="Dados dos Cupons" classe="mb-2">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <CardRelatorio 
                        descricao="Cupons usados" 
                        valor={totalAssinaturaComCupom} 
                        icon={<IconCalendarDollar size={62} />} 
                    />
                    
                    <CardRelatorio 
                        descricao="Cupons pagos" 
                        valor={totalAssinaturaComCupomPago} 
                        icon={<IconDatabaseDollar size={62} />} 
                    />
                    
                    <CardRelatorio 
                        descricao={`${isAdministrador() ? "Valores pagos" : "Valores recebidos"}`} 
                        valor={formatCurrencyBRL(valorPagoComCupom)} 
                        icon={<IconCalendarDollar size={62} />} 
                    />
                    
                    <CardRelatorio 
                        descricao={`${isAdministrador() ? "Valores a pagar" : "Valores a receber"}`} 
                        valor={formatCurrencyBRL(valorAPagarComCupom)} 
                        icon={<IconCalendarDollar size={62} />} 
                    />
                </div>
            </Card>

            <DataTable
                columns={columns(alterarPagamentoInfluencer, isAdministrador, carregarTotais)} 
                data={assinaturas} 
                page={page} 
                pageSize={pageSize} 
                totalCount={total}
                carregando={carregando}
            />
        </div>
    )
}