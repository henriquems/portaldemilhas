'use client'
import { useRouter } from "next/navigation"
import useSessao from "@/data/hooks/useSessao"
import Processando from "./Processando"
import { useEffect } from "react"
import { ReactNode } from "react";

interface ForcarAutenticacaoProps {
  children: ReactNode;
}

export default function ForcarAutenticacao({ children }: ForcarAutenticacaoProps) {
  const { usuario, carregando } = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario?.email) {
      router.push("/login");
    }
  }, [carregando, usuario, router]);

  if (carregando || !usuario?.email) {
    return <Processando />;
  }

  return <>{children}</>;
}