import React from "react"
import Image from "next/image"

export default async function Home() {
  return (
    <main className="min-h-screen bg-orange-100 flex justify-center items-center">

      <img src="/images/office-chair.png" alt="office chair" className="w-24 conveyor top-[20%]"/>
      <h1 className="text-amber-950 italic text-9xl z-10">META<span className="font-bold">VAULT</span></h1>

    </main>
  )

}
