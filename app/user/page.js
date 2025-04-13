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

    return (
        <main className="h-screen bg-orange-100 text-amber-950 px-4">
            <h1 className="pt-24 text-7xl italic">
                Welcome, <span className="font-bold">USER</span>
            </h1>
            <div className="flex">

            </div>
            <Link href="/"></Link>
            <Link href="/">
            </Link>
        </main>
    )

}