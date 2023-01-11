import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis";
import { useState, useEffect } from "react";
import { abi } from "../constants/abi";
import { BigNumber, ethers } from 'ethers';
import Connect from '../components/connect';
import Header from '../components/header';
import Description from '../components/description';
import IntroImage from '../components/introimage';
import Script from 'next/script';

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
  return (
    <div>
      <Header />
      <div className="contentWrapper">
        <Description />
        <IntroImage />
      </div>
      <Connect />
    </div>
  )
}
