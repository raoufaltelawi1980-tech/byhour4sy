"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError("صار خطأ بإرسال الكود، تأكد من الإيميل وحاول مرة تانية.");
      return;
    }
    setInfo("تم إرسال كود التحقق لإيميلك. تفقّد صندوق الوارد (وربما الرسائل غير المرغوبة).");
    setStep("otp");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError("الكود غلط أو منتهي الصلاحية. جرب ترسل كود جديد.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-primary mb-2 text-center">
        تسجيل الدخول
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        بالساعة — ثقة في كل معاملة
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4 text-center">
          {error}
        </div>
      )}
      {info && step === "otp" && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg p-3 mb-4 text-center">
          {info}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <input
            type="email"
            required
            placeholder="بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-xl py-3 font-bold disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "إرسال كود التحقق"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <input
            type="text"
            required
            inputMode="numeric"
            placeholder="أدخل الكود المرسل لإيميلك"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-xl py-3 font-bold disabled:opacity-50"
          >
            {loading ? "جاري التحقق..." : "تأكيد الدخول"}
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full text-sm text-gray-500 underline"
          >
            رجوع / تغيير الإيميل
          </button>
        </form>
      )}
    </main>
  );
}
