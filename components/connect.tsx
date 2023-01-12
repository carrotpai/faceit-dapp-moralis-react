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
import { useSession } from 'next-auth/react';
import getElo from '../pages/api/getElo';
import { GetStaticProps } from 'next';
import { create } from 'domain';

export default function Connect() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const { enableWeb3, isWeb3Enabled, account } = useMoralis();
    const [showModal, setShowModal] = useState(false);
    const [isAuthorised, setIsAuthorised] = useState(false);
    const [isAccountCreated, setIsAccountCreated] = useState(false);
    const [isParticipating, setIsParticipating] = useState(false);
    const [isClaimAvailable, setIsClaimAvailable] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        (async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);
            const playerAccountCreatedFilter = contract.filters.playerAccountCreated(signer._address);
            const playerAccountCreatedEvents = (await contract.queryFilter(playerAccountCreatedFilter));
            const playerHadParticipateFilter = contract.filters.playerHadParticipate(signer._address);
            const playerHadParticipateEvents = (await contract.queryFilter(playerHadParticipateFilter));
            if(playerAccountCreatedEvents[0] != undefined){
                setIsAccountCreated((await playerAccountCreatedEvents[0].decode(playerAccountCreatedEvents[0].data, playerAccountCreatedEvents[0].topics)[3]));
            }
            if(playerHadParticipateEvents[0] != undefined){
                setIsParticipating((await playerHadParticipateEvents[0].decode(playerHadParticipateEvents[0].data, playerHadParticipateEvents[0].topics)[1]));
            }
        })()
    }, [])

    async function sendInfo(name: string) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);
        const tx = await contract.createPlayerAccount(name, 20);
        await tx.wait();
        console.log(tx);
        setIsAccountCreated(true);
    }

    async function participate() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);
        const value = ethers.utils.parseEther("0.00375");
        const tx = await contract.participate({ value: value });
        await tx.wait();
        console.log(tx);
        setIsParticipating(true);
    }

    async function giveMoney(rating: number) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);
        if ((await contract.getTimeForNextClaim())) {
            setIsClaimAvailable(true);
            const tx = await contract.balanceAccrual(rating);
            await tx.wait();
            console.log(tx);
        }
    }

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
                session ? (
                    isWeb3Enabled ? (
                        isAccountCreated ? (
                            isParticipating ? (
                                isClaimAvailable ? (
                                    <button className='customButton claimButton' onClick={() => giveMoney(100)}>Claim</button>
                                ) : (
                                    <button className='customButton claimDisabledButton' disabled>Already claimed this week</button>
                                )
                            ) : (
                                <button className='customButton participateButton' onClick={() => participate()}>Participate</button>
                            )
                        ) : (
                            <button className="registerAccount customButton" onClick={() => sendInfo(session.user?.name)}>Create webwallet</button>
                        )
                    ) : (
                        <div>
                            <button className="connect customButton" onClick={() => enableWeb3()}>Connect</button>
                        </div>
                    )
                ) : (
                    <div>
                        <Login setIsAuthorised={setIsAuthorised} />
                    </div>
                )
            ) : (
                <p>Install metamask browser extension</p>
            )}

        </div >
    )
}