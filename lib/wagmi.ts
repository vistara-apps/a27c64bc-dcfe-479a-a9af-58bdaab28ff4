import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
    coinbaseWallet({
      appName: 'FairPlay Draws',
      appLogoUrl: '/logo.png',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

