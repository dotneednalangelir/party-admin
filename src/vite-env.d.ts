/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT?: string
  readonly VITE_DEV_BASE_URL?: string
  readonly VITE_DEV_TIMEOUT?: string
  readonly VITE_TEST_BASE_URL?: string
  readonly VITE_TEST_TIMEOUT?: string
  readonly VITE_PROD_BASE_URL?: string
  readonly VITE_PROD_TIMEOUT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
