
import React from "react";
import Link from "next/link";

export default async function NavBar() {

    return (
        <nav className="px-10 py-4 fixed z-10 text-amber-950 text-xl flex gap-x-6 *:hover:text-amber-600 *:px-2">
            {/* login link / signup link?*/}
            <Link className="italic" href="/">HOME</Link>
            <Link className="italic" href="/user">ACCOUNT</Link>
        </nav>
    )

} 