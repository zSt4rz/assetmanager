"use client"
import Link from "next/link";
import React from "react";
import { useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    // Check if user is signed into a session
    //   If not, return them to /login
      const { data: session, status } = useSession();
      const router = useRouter();
      
      useEffect(() => {
        if (status === 'unauthenticated') {
          router.push('/login') // or redirect somewhere else
        }
      }, [status, router])

      // Return Blank HTML element while loading
    if (status === 'loading') return (<main className="h-screen bg-orange-100"></main>)
    if (!session) return null // Retrun so the page doesn't load if user isn't logged In

    return (
        <main className="h-screen bg-orange-100 text-amber-950 px-4">
            <h1 className="pt-24 text-7xl italic">
                Welcome, <span className="font-bold">USER</span>
            </h1>
            <div className="flex">

            </div>
            <div className="mt-10 *:text-white *:text-xl *:py-2 *:px-6 *:bg-green-900 *:hover:bg-green-950 *:rounded-2xl justify-self-center self-center flex flex-col *:text-center gap-y-12 *:font-semibold">
                <Link href="/user/upload">Add Assets</Link>
                <Link href="/user/inventory">Browse Inventory</Link>
            </div>

        </main>
    )

}