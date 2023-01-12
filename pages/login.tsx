import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
const secret = process.env.NEXTAUTH_SECRET
import jwt from "jsonwebtoken"

const login = () => {
    const { data: session } = useSession();



    if (session) {
        return (
            <div>
                <p>Welcome, {JSON.stringify(session)}</p>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    } else {
        return (
            <button onClick={() => signIn()}>Sign in</button>
        )
    }
}

export default login;