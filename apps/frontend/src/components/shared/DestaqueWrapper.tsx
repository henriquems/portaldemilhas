'use client';

import { Suspense } from 'react';
import Destaque from './Destaque';

export default function DestaqueWrapper() {
  return (
    <Suspense fallback={<div className="text-slate-400">Carregando anúncios...</div>}>
      <Destaque />
    </Suspense>
  );
}
