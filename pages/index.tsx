import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import {useMoralis, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis";
import { useState, useEffect } from "react";
import { abi } from "../constants/abi";
import { BigNumber, ethers } from 'ethers';

const inter = Inter({ subsets: ['latin'] })

interface contractResponse {
  data: BigNumber;
}

function isContractResponse(obj: unknown): obj is contractResponse {
  return (
    typeof obj === 'object' && obj !== null && 'data' in obj
  );
}


export default function Home() {


  const [hasMetamask, setHasMetamask] = useState(false);
  const { enableWeb3, isWeb3Enabled, account } = useMoralis();

  async function getData(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);
    const balance: BigNumber = await contract.getBalance()
    return Number(balance.toHexString());
  }
  

  const {data, error, fetch, isFetching, isLoading} = useWeb3ExecuteFunction({
    abi: abi,
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "balanceAccrual",
    params: {
      _rating: 1,
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
        <button onClick={() => fetch()}>Execute</button>
      ) : (
        ""
      )}
    </div>
  )
}
