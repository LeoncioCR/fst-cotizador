export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "FST Cotizador",

  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  company: {
    name: "FST Negocios",
  },
} as const;
