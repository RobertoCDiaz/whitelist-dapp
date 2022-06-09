import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css'

import Web3Modal, { WEB3_CONNECT_MODAL_ID } from 'web3modal';
import { providers, Contract } from 'ethers';
import { abi, WHITELIST_CONTRACT_ADDRESS } from '../constants';

export default function Home() {
  // current count of whitelisted addresses. by default is set to 0.
  const [whiteListCount, setWhiteListCount] = useState(0);

  // keeps track of whether a wallet is connected or not
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // this variable tells us if the current connected address is already whitelisted or not
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(false);

  // loading is set to true while we wait for a transaction to be mined into the network
  const [isLoading, setIsLoading] = useState(false);

  // reference to the Web3Modal (used to connect to metamask)
  const web3ModalRef = useRef();

  /**
   * Gets the Web3 Provider, or a Web3 Signer if needed.
   * 
   * @param {*} needSigner - Set to true if a signer is needed. Otherwise, it can stay as false.
   * 
   * @returns A provider if a signer is not needed. A signer if `true` is passed on as an argument.
   */
  const getProviderOrSigner = async (needSigner = false) => {
    try {
      // connect to metamask
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      // see if metamask is currently connected to the rinkeby network (id == 4),
      // if not, throw an error
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 4) {
        window.alert("This dApp only works on the Rinkeby Network");
        throw new Error("This dApp only works on the Rinkeby Network");
      }

      return needSigner ? web3Provider.getSigner() : web3Provider;
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Gets the most recent count of addresses currently whitelisted and updated
   * the corresponding state variable.
   */
  const updateWhiteListedCount = async () => {
    try {
      // because we are just reading from the blockchain, we don't need a signer and a provider is enough
      const provider = await getProviderOrSigner();

      // create contract
      const WhitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider,
      );

      // read the contract variable directly as a function call
      // this return a BigNumber
      const count = await WhitelistContract.whitelistedCount();

      // update state variable using a normal int instead of the received BigNumber
      setWhiteListCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Adds current connected address to the whitelist.
   */
  const addToWhiteList = async () => {
    try {
      // a signer is needed as we need to write to the blockchain state
      const signer = await getProviderOrSigner(true);

      // create contract
      const WhitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS, 
        abi,
        signer,
      );

      // create a transaction to add current user to the whitelist
      const tx = await WhitelistContract.addAddress();

      // wait for the transaction to finish
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);

      // update web state variables:
      // update whitelisted addresses count and if current user is in the whitelist or not
      await updateWhiteListedCount()
      setIsUserWhitelisted(true);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Checks if the current connected address is already in the whitelist.
   * It also updates the correponding state variable.
   */
  const checkIfWhitelisted = async () => {
    try {
      // even though we are not explicitly writing to the blockchain, we still need a signer
      // because from it we can obtain the user address
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer,
      );

      setIsUserWhitelisted(await contract.whitelisted(signer.getAddress()));
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Connects to the wallet. (e.g. Metamask).
   */
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setIsWalletConnected(true);

      await checkIfWhitelisted();
      await updateWhiteListedCount();
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * A custom React component that returns different views depending on the state of various variables.
   * 
   * If a wallet is not connected to the app, it will return a `Connect to wallet` button.
   * 
   * Otherwise, it will check if the current connected address is in the whitelist.
   * If it is, it will return just an informational stamp thanking the user for joining the whitelist.
   * If not, it will render a `Join the whiteliste` button.
   * 
   * Also, if there is currently a transaction being mined, it will return a `Loading` button.
   * 
   * @returns Button Component
   */
  const JoinWhiteListButton = () => {
    if (isLoading) {
      // loading stamp on button
      return (<div className={styles.button}>
        Loading...
      </div>);
    }

    if (!isWalletConnected) {
      // connect to wallet button
      return (<div onClick={connectWallet} className={styles.button}>
        Connect to your wallet
      </div>);
    }
    
    if (isUserWhitelisted) {
      // already in whitelist
      return (<div className="information">
        Thanks for joining the whitelist!
      </div>);
    } else {
      // join to whitelist
      return (<div onClick={addToWhiteList} className={styles.button}>
        Join the whitelist!
      </div>);
    }
  }
    
  useEffect(() => {
    if (!isWalletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
    }
    
  }, [isWalletConnected, isUserWhitelisted]);

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
          <p>There are currently {whiteListCount} users in the whitelist</p>
          {JoinWhiteListButton()}
        </div>
      </main>
    </div>
  );
}
