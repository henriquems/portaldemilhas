import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import { IconChevronLeft, IconClipboardText } from "@tabler/icons-react";
import Link from "next/link";

export default function PoliticaDePrivacidade() {
    return (
        <>
            <TituloPagina icone={<IconClipboardText />} descricao="Política de Privacidade" />

            <Card>
                <div className="text-slate-400 space-y-4">
                    <h2 className="text-lg font-semibold">1. Introdução</h2>
                    <p>
                        A sua privacidade é importante para nós. Esta Política de Privacidade tem como objetivo esclarecer como
                        coletamos, usamos, armazenamos e protegemos os dados pessoais dos usuários do site 
                        <span className="text-white font-medium"> portaldemilhas.com.br</span>, em conformidade com a Lei Geral 
                        de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD).
                    </p>
                    <p>
                        Ao acessar ou utilizar nossos serviços, você concorda com os termos desta Política.
                    </p>

                    <h2 className="text-lg font-semibold">2. Dados Coletados</h2>
                    <p>Podemos coletar as seguintes informações:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Dados fornecidos pelo usuário: e-mail, número de telefone, CPF para realização de cadastros, transações ou atendimentos.</li>
                    </ul>

                    <h2 className="text-lg font-semibold">3. Finalidade do Tratamento</h2>
                    <p>Os dados coletados são utilizados para:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Identificação e autenticação do usuário;</li>
                        <li>Processamento de transações de milhas;</li>
                        <li>Envio de ofertas, promoções e comunicações relacionadas aos serviços;</li>
                        <li>Análise de uso do site para melhoria contínua;</li>
                        <li>Cumprimento de obrigações legais e regulatórias;</li>
                        <li>Prevenção a fraudes e segurança da informação.</li>
                    </ul>

                    <h2 className="text-lg font-semibold">4. Compartilhamento de Dados</h2>
                    <p>Não compartilhamos seus dados.</p>
                    <p>Não vendemos ou alugamos seus dados pessoais.</p>

                    <h2 className="text-lg font-semibold">5. Cookies e Tecnologias de Rastreamento</h2>
                    <p>Não utilizamos cookies ou tecnologias semelhantes.</p>

                    <h2 className="text-lg font-semibold">6. Armazenamento e Segurança dos Dados</h2>
                    <p>
                        Os dados são armazenados em ambiente seguro e controlado, com uso de criptografia e outras medidas de proteção 
                        compatíveis com os padrões de mercado. Apenas pessoas autorizadas têm acesso às informações, e todos os acessos são monitorados.
                    </p>

                    <h2 className="text-lg font-semibold">7. Direitos do Titular</h2>
                    <p>Você tem o direito de:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Confirmar a existência de tratamento;</li>
                        <li>Acessar, corrigir ou atualizar seus dados;</li>
                        <li>Revogar o consentimento, quando aplicável;</li>
                        <li>Reclamar junto à ANPD (Autoridade Nacional de Proteção de Dados).</li>
                    </ul>
                    <p>
                        Para exercer esses direitos, entre em contato conosco através do e-mail: 
                        <a href="mailto:contato@portaldemilhas.com.br" className="text-white underline ml-1">
                        contato@portaldemilhas.com.br
                        </a>.
                    </p>

                    <h2 className="text-lg font-semibold">8. Retenção dos Dados</h2>
                    <p>
                        Os dados pessoais serão mantidos pelo tempo necessário para cumprir as finalidades aqui descritas ou 
                        conforme exigido por obrigações legais, regulatórias ou contratuais.
                    </p>

                    <h2 className="text-lg font-semibold">9. Alterações na Política de Privacidade</h2>
                    <p>
                        Esta Política pode ser atualizada a qualquer momento. Recomendamos que você a revise periodicamente. 
                        Alterações relevantes serão comunicadas de forma destacada em nosso site.
                    </p>

                    <h2 className="text-lg font-semibold">10. Contato</h2>
                    <p>
                        Em caso de dúvidas, solicitações ou reclamações relacionadas à privacidade ou ao tratamento de seus 
                        dados pessoais, entre em contato com nosso Encarregado de Dados (DPO):
                    </p>
                    <p>
                        E-mail: 
                        <a href="mailto:contato@portaldemilhas.com.br" className="text-white underline ml-1">
                        contato@portaldemilhas.com.br
                        </a>
                    </p>
                </div>
            </Card>
            <div className="flex items-center justify-end mt-5 mr-2">
                <Link href="/" className="flex items-center link"><IconChevronLeft /> Voltar</Link>
            </div>
        </>
    )
}