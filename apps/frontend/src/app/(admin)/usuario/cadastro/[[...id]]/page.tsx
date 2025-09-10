'use client'
import TituloPagina from "@/components/shared/TituloPagina";
import useUsuario from "@/data/hooks/useUsuario";
import Card from "@/components/shared/Card";
import Link from "next/link";
import { StatusUsuario } from "@portaldemilhas/core"
import { IconChevronLeft, IconDeviceFloppy, IconFileText, IconUsers } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PatternFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function CadastroUsuario() {
    const { salvar, form, perfis } = useUsuario()
    
    return (
        <div>
            <TituloPagina 
                descricao="Cadastro de Usuários" 
                icone={<IconUsers width={20} height={20} />} 
            />

            <Card titulo="Dados do Usuário"
                icon={<IconFileText width={18} height={18} />}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(salvar)}>
                        <div className="w-full lg:w-[50%] mt-2">
                            <div className="grid md:grid-cols-2 sm:grid-cols-1 w-full gap-5">
                                <div className="flex flex-col gap-1">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full min-h-[2.5rem] 
                                                            !text-zinc-900 text-[16px] lg:text-[14px] border 
                                                            bg-zinc-300 border-zinc-500">
                                                            <SelectValue placeholder="Selecione aqui..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-300 border border-zinc-500">
                                                    {Object.entries(StatusUsuario).map(([key, status]) => (
                                                        <SelectItem key={key} value={key} className="text-zinc-900">
                                                        {status.descricao}
                                                        </SelectItem>
                                                    ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <FormField
                                        control={form.control}
                                        name="perfis"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                            <FormLabel className="mb-1">Perfis</FormLabel>
                                            {perfis.length === 0 ? (
                                                <p className="text-xs text-muted-foreground">Carregando perfis...</p>
                                            ) : (
                                                <Popover>
                                                    <PopoverTrigger asChild className="border border-zinc-500 h-10">
                                                        <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="w-full bg-zinc-300 text-zinc-900 flex justify-between font-normal px-3 py-2"
                                                            >
                                                            <span className="flex-1 text-left truncate">
                                                                {field.value?.length
                                                                ? field.value.map((p) => p.nome).join(", ")
                                                                : "Selecione aqui..."}
                                                            </span>
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[360px] p-0 border border-zinc-500 rounded-lg">
                                                        <Command className="bg-zinc-300">
                                                        <CommandEmpty>Nenhum perfil encontrado.</CommandEmpty>
                                                        <CommandGroup>
                                                            {perfis.map((perfil) => {
                                                                const isSelected = field.value?.some((p) => p.id === perfil.id)

                                                                return (
                                                                    <CommandItem
                                                                        key={perfil.id}
                                                                        onSelect={() => {
                                                                            const atual = field.value ?? []
                                                                            const newValue = isSelected
                                                                            ? atual.filter((p) => p.id !== perfil.id)
                                                                            : [...atual, perfil]
                                                                            field.onChange(newValue)
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <div className="text-[12px] text-zinc-900">
                                                                                {perfil.nome}
                                                                            </div>
                                                                            <div>
                                                                                <Check
                                                                                    className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    isSelected ? "opacity-100 text-slate-400" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </CommandItem>
                                                                )
                                                            })}
                                                        </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <FormField 
                                        control={form.control}
                                        name="nome"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Nome</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-zinc-300 text-zinc-900 border border-zinc-500 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <FormField 
                                        control={form.control}
                                        name="cpf"
                                        render={({ field: { onChange, value, ref, ...rest } }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">CPF</FormLabel>
                                                <FormControl>
                                                    <PatternFormat
                                                        {...rest}
                                                        value={value ?? ''}
                                                        getInputRef={ref}
                                                        onValueChange={(values) => onChange(values.formattedValue)}
                                                        format="###.###.###-##"
                                                        mask="_"
                                                        allowEmptyFormatting
                                                        className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10 w-full px-2 rounded-md"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <FormField 
                                        control={form.control}
                                        name="telefone"
                                        render={({ field: { onChange, value, ref, ...rest } }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Telefone</FormLabel>
                                                <FormControl>
                                                    <PatternFormat
                                                        {...rest}
                                                        value={value ?? ''}
                                                        getInputRef={ref}
                                                        onValueChange={(values) => onChange(values.formattedValue)}
                                                        format="(##) #####-####"
                                                        mask="_"
                                                        allowEmptyFormatting
                                                        className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10 w-full px-2 rounded-md"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <FormField 
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">E-mail</FormLabel>
                                                <FormControl>
                                                    <Input {...field} onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                                        className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <FormField 
                                        control={form.control}
                                        name="senha"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field}
                                                        className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <FormField 
                                        control={form.control}
                                        name="repitaSenha"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Repita Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} 
                                                        className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-8">
                                <button type="submit" className="w-full botao primario">
                                    <IconDeviceFloppy width={18} height={18} />
                                    <span>Salvar</span>
                                </button>
                                <Link href="/usuario" className="botao secundario">
                                    <IconChevronLeft width={18} height={18} />
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