import '../styles/globals.css'
import '../styles/greetingPage.css'
import type { AppProps } from 'next/app'
import { MoralisProvider } from 'react-moralis'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps, session }: any) {
  return (
    <MoralisProvider
      initializeOnMount={false}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MoralisProvider>
  )
}
