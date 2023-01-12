import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
const secret = process.env.NEXTAUTH_SECRET
import jwt from "jsonwebtoken"

const login = ({setIsAuthorised, ...rest}) => {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>Welcome, {JSON.stringify(session)}</p>
                <button className="customButton signOutButton" onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    } else {
        return (
            <button className="customButton signInButton" onClick={() => {signIn()
                 setIsAuthorised(true)}}>Sign in with faceit</button>
        )
    }
}

export default login;