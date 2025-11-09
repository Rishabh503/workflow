

"use client"

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import logo from "../../../public/logo.png";
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#0f172a] text-white sticky top-0 z-50 border-b border-[#1e293b]">
      <div className="max-w-8xl mx-auto px-24 py-4 flex items-center justify-between">
        
        {/* logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src={logo} alt="logo" width={40} height={40} className="rounded-lg bg-white p-1"/>
          </Link>
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight">StudyFlow</h1>
          </Link>
        </div>

        {/* desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/subjects" className="hover:text-blue-400">Subjects</Link>
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/goal" className="hover:text-blue-400">Goals</Link>
          <Link href="/sessions" className="hover:text-blue-400">Sessions</Link>
        </div>

        {/* auth */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 text-sm border border-blue-500 rounded-full text-blue-400 hover:bg-blue-500 hover:text-white">Sign In</button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 text-sm bg-blue-600 rounded-full hover:bg-blue-500">Sign Up</button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28}/> : <Menu size={28}/>}
        </button>

      </div>

      {/* mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#1e293b] px-6 pb-4 space-y-4">
          <Link href="/subjects" className="block">Subjects</Link>
          <Link href="/dashboard" className="block">Dashboard</Link>
          <Link href="/goal" className="block">Goals</Link>
          <Link href="/sessions" className="block">Sessions</Link>

          <div className="pt-4 border-t border-gray-700">
            <SignedOut>
              <SignInButton>
                <button className="w-full border border-blue-400 rounded-full py-2 text-blue-400 hover:bg-blue-400 hover:text-white">Sign In</button>
              </SignInButton>
              <SignUpButton>
                <button className="w-full bg-blue-600 text-white rounded-full py-2 mt-2 hover:bg-blue-500">Sign Up</button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  )
}

