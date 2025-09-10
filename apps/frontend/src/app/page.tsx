'use client'
import Destaque from "@/components/shared/Destaque";
import Negocio from "@/components/shared/Negocio";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-7">
        <Negocio />
        <Suspense fallback={<div>Carregando...</div>}>
          <Destaque /> 
        </Suspense>
    </div>
  );
}
