import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta property="og:url" content="https://existence.aualrxse.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="What is the 'existence' ?" />
      <meta property="og:description" content="A site of an installation created by arata matsumoto" />
      <meta property="og:site_name" content="Existence - arata matsumoto" />
      <meta property="og:image" key="ogImage" content="https://existence.aualrxse.com/images/og.png" />
      <meta name="twitter:card" key="twitterCard" content="summary_large_image" />
      <meta name="twitter:site" content="@aualrxse" />
    </Head>
    <Component {...pageProps} />
  </>
}
