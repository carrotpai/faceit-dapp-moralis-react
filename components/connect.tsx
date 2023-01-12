import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis";
import { useState, useEffect } from "react";
import { abi } from "../constants/abi";
import { BigNumber, Contract, ethers } from 'ethers';
import { Button, Space } from 'antd';
import Link from 'next/link';
import Script from 'next/script';
import ModalWindow from "../components/modalWindow"
import { useRouter } from 'next/router'
import Login from '../pages/login';

export default function Connect() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const { enableWeb3, isWeb3Enabled, account } = useMoralis();
    const [showModal, setShowModal] = useState(false);
    const [isAuthorised, setIsAuthorised] = useState(false);

    const router = useRouter()

    async function sendInfo() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);
        const tx = await contract.createPlayerAccount("jopa", 20);
        await tx.wait();
        console.log(tx);
    }
        

    async function getData() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);
        const balance: BigNumber = await contract.getBalance()
        return Number(balance.toHexString());
    }


    const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction({
        abi: abi,
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        functionName: "balanceAccrual",
        params: {
            _rating: 1,
        },
    });


    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            console.log("metamask!")
            setHasMetamask(true);
        }
    }, [])

    

    return (
        <div>
            <ModalWindow onClose={() => setShowModal(false)}
                onSubmit={() => { setIsAuthorised(true); setShowModal(false) }}
                show={showModal}
            />
            {hasMetamask ? (
                isWeb3Enabled ? (
                    isAuthorised ? (
                        <button className="registerAccount customButton" onClick={()=>sendInfo()}>Register Account</button>
                    ) : (
                        <div>
                            <Login/>
                        </div>
                    )
                ) : (
                    <div>
                        <button className="connect customButton" onClick={() => enableWeb3()}>Connect</button>
                    </div>
                )
            ) : (
                <p>Install metamask browser extension</p>
            )}

        </div >
    )
}