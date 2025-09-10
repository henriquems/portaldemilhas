'use client';

import ForcarAutenticacao from "@/components/shared/ForcarAutenticacao";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: AdminLayoutProps) {
  return (
    <ForcarAutenticacao>
      {children}
    </ForcarAutenticacao>
  );
}
