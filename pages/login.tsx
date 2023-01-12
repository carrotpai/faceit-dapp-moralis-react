import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
const secret = process.env.NEXTAUTH_SECRET
import jwt from "jsonwebtoken"

const login = ({ setIsAuthorised, setShowBlock, ...rest }) => {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>Welcome, { }</p>
                <button className="customButton signOutButton" onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    } else {
        return (
            <div className="buttonWrapper">
                <button className="customButton connect" onClick={() => {
                    signIn()
                    setIsAuthorised(true)
                    setShowBlock(false)
                }}>Sign in with faceit</button>
            </div>
        )
    }
}

export default login;