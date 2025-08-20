/// <reference types="vite/client" />

// Optional: make VITE_API_BASE strongly typed
interface ImportMetaEnv {
    readonly VITE_API_BASE?: string
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}