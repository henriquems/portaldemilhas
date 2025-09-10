
'use client'
import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import useCadastro from "@/data/hooks/useCadastro";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { IconArrowLeft, IconDeviceFloppy, IconUserPlus } from "@tabler/icons-react";
import { PatternFormat } from 'react-number-format';
import Processando from "@/components/shared/Processando";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@radix-ui/react-scroll-area";

export default function Cadastro() {
    const { form, carregando, usuario, salvarComStatus } = useCadastro();

    return (
        <div>
            { carregando && <Processando />}
            
            <TituloPagina descricao="Cadastro de Usuário" icone={<IconUserPlus />} />
           
            <Card titulo="Dados de cadastro" >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(salvarComStatus)}>
                        <div className="w-full lg:w-[50%]">
                            <div className="flex flex-col gap-4">
                                <FormField 
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300 mb-1">Nome</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />

                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300 mb-1">E-mail</FormLabel>
                                            <FormControl>
                                                <Input {...field} onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                                    className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />

                                <div className="flex gap-4">
                                    <FormField 
                                        control={form.control}
                                        name="cpf"
                                        render={({ field: { onChange, value, ref, ...rest } }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-slate-300 mb-1">CPF</FormLabel>
                                                <FormControl>
                                                    <PatternFormat
                                                        {...rest}
                                                        value={value ?? ''}
                                                        getInputRef={ref}
                                                        onValueChange={(values) => onChange(values.formattedValue)}
                                                        format="###.###.###-##"
                                                        mask="_"
                                                        allowEmptyFormatting
                                                        className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10 w-full px-2 rounded-md"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />

                                     <FormField 
                                        control={form.control}
                                        name="telefone"
                                        render={({ field: { onChange, value, ref, ...rest } }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-slate-300 mb-1">Telefone</FormLabel>
                                                <FormControl>
                                                    <PatternFormat
                                                        {...rest}
                                                        value={value ?? ''}
                                                        getInputRef={ref}
                                                        onValueChange={(values) => onChange(values.formattedValue)}
                                                        format="(##) #####-####"
                                                        mask="_"
                                                        allowEmptyFormatting
                                                        className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10 w-full px-2 rounded-md"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>

                                 <div className="flex gap-4">
                                    <FormField 
                                        control={form.control}
                                        name="senha"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-slate-300 mb-1">Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} 
                                                        className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="repitaSenha"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-slate-300 mb-1">Repita Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} 
                                                        className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>
                            </div> 

                            { !usuario && (
                                <div>
                                    <ScrollArea className="h-52 bg-zinc-800 w-full rounded-md border-2 border-zinc-600 mt-5">
                                        <ScrollAreaViewport className="p-2">
                                            <div className="text-white space-y-4">
                                                <h1 className="text-xl font-semibold">Termo de Uso</h1>
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
                                        </ScrollAreaViewport>

                                        <ScrollAreaScrollbar
                                            orientation="vertical"
                                            className="w-2 bg-transparent"
                                            forceMount 
                                        >
                                            <ScrollAreaThumb className="bg-white rounded" />
                                        </ScrollAreaScrollbar>
                                    </ScrollArea>                                  
                                    
                                    <div className="flex items-center gap-2">
                                        <FormField
                                            control={form.control}
                                            name="aceitouTermo"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2 mt-5">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value || false}
                                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                                        onBlur={field.onBlur}
                                                    />
                                                </FormControl>
                                                <span className="text-orange-400">Li e concordo com o termo de uso acima</span>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-8">
                                <button type="submit" className="w-full flex gap-1 botao primario">
                                    <IconDeviceFloppy width={18} height={18} /> Cadastrar
                                </button>                      
                                
                                <Link href="/" className="flex items-center gap-1 
                                    hover:text-slate-300 botao secundario">
                                    <IconArrowLeft width={18} height={18} />
                                    <span>Voltar</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}