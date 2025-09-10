import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import { IconChevronLeft, IconClipboardText } from "@tabler/icons-react";
import Link from "next/link";

export default function TermosDeUso() {
    return (
        <>
            <TituloPagina icone={<IconClipboardText />} descricao="Termo de Uso" />

            <Card>
                <div className="text-slate-400 space-y-4">
                    <h2 className="text-lg font-semibold">1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar ou utilizar o site 
                        <span className="text-white font-medium"> www.portaldemilhas.com.br</span> (“Portal de Milhas”), 
                        você concorda com os presentes Termos de Uso e com todas as demais políticas aplicáveis, 
                        incluindo a Política de Privacidade. Caso não concorde com estes termos, por favor, 
                        não utilize os serviços do site.
                    </p>

                    <h2 className="text-lg font-semibold">2. Descrição dos Serviços</h2>
                    <p>O Portal de Milhas oferece uma plataforma digital destinada a:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Disponibilizar um espaço virtual para que usuários anunciem a compra e venda de milhas aéreas;</li>
                        <li>Outras funcionalidades que possam ser implementadas futuramente.</li>
                    </ul>
                    <p className="font-medium text-white">
                        Importante: O Portal de Milhas não é intermediador, consultor, proprietário ou detentor das milhas anunciadas. 
                        O site não interfere na formação de preços e não garante a efetivação das transações. 
                        Todas as negociações são realizadas diretamente entre usuários (anunciantes e compradores).
                    </p>

                    <h2 className="text-lg font-semibold">3. Cadastro e Conta do Usuário</h2>
                    <p>
                        Para utilizar determinadas funcionalidades, o usuário poderá ser obrigado a realizar um cadastro, 
                        fornecendo dados pessoais verídicos, completos e atualizados. O usuário é o único responsável pela veracidade 
                        das informações prestadas e pela segurança de seu login e senha.
                    </p>
                    <p>
                        O uso indevido da conta, incluindo atividades fraudulentas ou ilegais, poderá acarretar o bloqueio ou encerramento 
                        imediato do acesso, sem prejuízo das medidas legais cabíveis.
                    </p>

                    <h2 className="text-lg font-semibold">4. Obrigações do Usuário</h2>
                    <p>Ao utilizar o site, o usuário se compromete a:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Não utilizar os serviços para fins ilícitos ou que violem direitos de terceiros;</li>
                        <li>Não inserir ou transmitir vírus, scripts maliciosos ou qualquer outro código nocivo;</li>
                        <li>Manter seus dados atualizados e corretos;</li>
                        <li>Assumir integralmente a responsabilidade pelas negociações realizadas por meio dos anúncios publicados.</li>
                    </ul>

                    <h2 className="text-lg font-semibold">5. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo disponibilizado no Portal de Milhas, incluindo textos, imagens, logotipos, marcas, vídeos, 
                        gráficos e códigos-fonte, é protegido por direitos autorais e de propriedade intelectual. 
                        É proibida a reprodução, distribuição ou qualquer uso não autorizado sem o consentimento prévio e escrito do titular dos direitos.
                    </p>

                    <h2 className="text-lg font-semibold">6. Isenção de Responsabilidade</h2>
                    <p>O Portal de Milhas:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Não é proprietário dos produtos anunciados e não tem posse de qualquer milha ou bem ofertado;</li>
                        <li>Não interfere na definição de preços dos anúncios;</li>
                        <li>Não garante disponibilidade ininterrupta da plataforma, que poderá sofrer interrupções por motivos técnicos ou operacionais;</li>
                        <li>Não se responsabiliza pela veracidade, qualidade ou cumprimento das ofertas publicadas;</li>
                        <li>Não responde por prejuízos decorrentes de negociações entre usuários.</li>
                    </ul>
                    <p>
                        Em caso de problemas em uma transação, qualquer reclamação ou pedido de indenização deverá ser feito diretamente ao anunciante.
                    </p>
                    <p>
                        Antes de concluir qualquer negociação, recomendamos que os usuários leiam atentamente as dicas de segurança disponíveis no site.
                    </p>

                    <h2 className="text-lg font-semibold">7. Modificações nos Termos</h2>
                    <p>
                        Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento, sem aviso prévio. 
                        Recomendamos que os usuários os revisem periodicamente. 
                        O uso continuado da plataforma após as alterações implica concordância com os novos termos.
                    </p>

                    <h2 className="text-lg font-semibold">8. Encerramento dos Serviços</h2>
                    <p>
                        O Portal poderá, a seu exclusivo critério, encerrar ou suspender os serviços oferecidos no site, 
                        de forma temporária ou definitiva, sem que isso gere qualquer tipo de indenização ao usuário.
                    </p>

                    <h2 className="text-lg font-semibold">9. Lei Aplicável e Foro</h2>
                    <p>
                        Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                        Fica eleito o foro da comarca de <span className="text-white font-medium">Belo Horizonte/MG</span> 
                        para dirimir eventuais controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.
                    </p>

                    <h2 className="text-lg font-semibold">10. Contato</h2>
                    <p>
                        Para esclarecimentos, dúvidas ou solicitações, entre em contato com nossa equipe pelo e-mail: 
                        <a href="mailto:contato@portaldemilhas.com.br" className="text-white underline ml-1">
                            contato@portaldemilhas.com.br
                        </a>.
                    </p>
                </div>
            </Card>

            <div className="flex items-center justify-end mt-5 mr-2">
                <Link href="/" className="flex items-center link"><IconChevronLeft /> Voltar</Link>
            </div>
        </>
     )
}
