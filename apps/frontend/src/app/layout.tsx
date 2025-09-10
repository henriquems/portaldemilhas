import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import Pagina from "@/components/template/Pagina";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProvedorSessao } from "@/data/contexts/ContextoSessao";
import { ProcessandoProvider } from "@/data/contexts/ContextoProcessando";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal de Milhas",
  description: "Portal de Milhas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextTopLoader
          color="#1447e6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        
        <ProvedorSessao>
          <ProcessandoProvider>
            <Pagina>{children}</Pagina>
          </ProcessandoProvider>
        </ProvedorSessao>
        
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </body>
    </html>
  );
}
