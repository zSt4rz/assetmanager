// /app/signup/page.js
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    router.push("/login");
  }

  return (
    <main className="h-screen text-amber-950 flex items-center justify-center bg-orange-100">
      <div className="bg-white p-6 rounded shadow-md w-80 space-y-2">
        <h2 className="text-xl font-semibold">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Email" className="w-full border border-gray-300 p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" className="w-full border border-gray-300 p-2 rounded" value={password} type="password" onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-green-900 text-white p-2 rounded hover:bg-green-950">Sign Up</button>
        </form>
        <p>Already have an account? Login <Link href="/login" className="underline">here</Link>.</p>
      </div>
    </main>

  );
}
