import React from "react"
import Image from "next/image"

export default async function Home() {
  return (
    <main className="min-h-screen bg-orange-100 flex justify-center items-center">
      <img src="/images/car.png" alt="car" className="h-36 conveyor-reverse top-[58%]"/>
      <img src="/images/laptop.png" alt="laptop" className="h-36 conveyor-reverse top-[58%]" style={{ animationDelay: "1s" }}/>

      <img src="/images/sofa.png" alt="sofa" className="h-36 conveyor top-[18%]" style={{ animationDelay: "2s" }}/>

      <img src="/images/office-chair.png" alt="office chair" className="h-36 conveyor top-[18%]"/>
      <img src="/images/chair.png" alt="chair" className="h-36 conveyor top-[18%]" style={{ animationDelay: "1s" }}/>


      <h1 className="text-amber-950 italic text-9xl z-10">META<span className="font-bold">VAULT</span></h1>
    </main>
  )

}
