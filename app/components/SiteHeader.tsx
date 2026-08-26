"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import AuthButton from "@/app/components/AuthButton";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/#categories", label: "التصنيفات" },
  { href: "/#requests", label: "الطلبات" },
  { href: "/#services", label: "الخدمات" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo-new.png?v=4"
            alt="بالساعة"
            width={40}
            height={40}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-bold text-gray-700 hover:text-primary transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <AuthButton />
          <Link
            href="/post"
            className="bg-accent text-white rounded-xl px-4 py-2 text-sm font-bold hover:opacity-90 transition"
          >
            + أضف إعلان
          </Link>
        </div>

        <button
          className="md:hidden text-primary"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="القائمة"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold text-gray-700"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2 border-t">
            <AuthButton />
            <Link
              href="/post"
              className="bg-accent text-white rounded-xl px-4 py-2 text-sm font-bold"
            >
              + أضف إعلان
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
