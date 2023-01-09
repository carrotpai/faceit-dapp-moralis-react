import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import {useMoralis, useWeb3Contract} from "react-moralis";
import { useState, useEffect } from "react";
import { abi } from "../constants/abi";

const inter = Inter({ subsets: ['latin'] })


export default function Home() {


  const [hasMetamask, setHasMetamask] = useState(false);
  const { enableWeb3, isWeb3Enabled } = useMoralis();

  const {data, error, runContractFunction, isFetching, isLoading} = 
    useWeb3Contract({
      abi: abi,
      contractAddress: "xxx",
      functionName: "store",
      params: {
        _favoriteNumber: 42,
      },
    });

  useEffect(()=>{
    if (typeof window.ethereum !== "undefined"){
      console.log("metamask!")
      setHasMetamask(true);
    }
  }, [])

  return (
    <div>
      {hasMetamask ? (
        isWeb3Enabled ? (
          "Connected"
        ) : (
          <button onClick={()=> enableWeb3()}>Connect</button>
        )
      ) : (
        "Install metamask"
      )}

      {isWeb3Enabled ? (
        <button onClick={()=> runContractFunction()}></button>
      ) : (
        ""
      )}
    </div>
  )
}
