/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMISSIONS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
