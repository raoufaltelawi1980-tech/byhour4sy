"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

export default function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-primary/80">{user.email}</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-red-600 underline"
        >
          خروج
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-primary text-white rounded-xl px-5 py-2 text-sm font-bold"
    >
      تسجيل الدخول
    </Link>
  );
}
