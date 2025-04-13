
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default async function NavBar() {
    // const { data: session, status } = useSession();
    // const [user, setUser] = useState("LOGIN"); 
  
    // useEffect(() => {
    //     if (status === 'unauthenticated') {
    //         setUser("LOGIN")
    //     } else if (status === 'authenticated') {
    //         setUser("ACCOUNT")
    //     }
    // }, [status])

    return (
        <nav className="px-10 py-4 fixed z-10 text-amber-950 text-xl flex gap-x-6 *:hover:text-amber-600 *:px-2">
            {/* login link / signup link?*/}
            <Link className="italic" href="/">HOME</Link>
            <Link className="italic" href="/user">ACCOUNT</Link>
        </nav>
    )

} 