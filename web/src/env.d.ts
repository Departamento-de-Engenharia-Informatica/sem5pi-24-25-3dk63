/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MDTASK_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@heroicons/react/solid' {
  import * as React from 'react';

  export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}
