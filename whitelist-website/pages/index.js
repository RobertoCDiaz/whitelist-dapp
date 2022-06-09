import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [whiteListCount, setWhiteListCount] = useState(0);

  return (
    <div className={styles.page}>
      <Head>
        <title>Whitelist dApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <img className={styles.image} src="crypto-devs.svg" alt="crypto-devs image" />
        <div className={styles.content}>
          <h1>Welcome to WhitelistedCrypto!</h1>
          <p>A new NFT collection for which you can have previous whitelist access</p>
          <p>There are currently <span className={styles.count}>{whiteListCount}</span> users in the whitelist</p>
          <div className={styles.button}>Join the whitelist!</div>
        </div>
      </main>
    </div>
  );
}
