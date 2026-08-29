"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

const PLACEMENTS = [
  { code: "home_top", label: "أعلى الصفحة الرئيسية" },
  { code: "home_middle", label: "وسط الصفحة الرئيسية (بعد التصنيفات)" },
  { code: "category_top", label: "أعلى صفحة كل تصنيف" },
];

const DURATIONS = [
  { key: "day", label: "يوم واحد (24 ساعة)" },
  { key: "week", label: "أسبوع" },
  { key: "month", label: "شهر" },
];

export default function AdvertisePage() {
  const { user, loading } = useAuth();
  const [placement, setPlacement] = useState(PLACEMENTS[0].code);
  const [duration, setDuration] = useState("day");
  const [amount, setAmount] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!loading && !user) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl card-shadow p-10">
          <h1 className="text-xl font-bold text-primary mb-3">لازم تسجل دخول أول</h1>
          <p className="text-gray-500 mb-6">تقديم عرض على بنر إعلاني يحتاج حساب مسجّل.</p>
          <Link href="/login" className="bg-primary text-white rounded-xl px-6 py-3 font-bold inline-block">
            تسجيل الدخول
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError("لازم تدخل مبلغ عرض صحيح.");
      return;
    }
    if (!targetUrl.trim()) {
      setError("لازم تحدد رابط الوجهة (موقعك أو صفحتك).");
      return;
    }

    setSubmitting(true);

    const { data: auctionId, error: auctionError } = await supabase.rpc(
      "get_or_create_open_auction",
      { p_placement_code: placement }
    );

    if (auctionError || !auctionId) {
      setError("صار خطأ بفتح المزاد: " + (auctionError?.message ?? "غير معروف"));
      setSubmitting(false);
      return;
    }

    const { error: bidError } = await supabase.from("banner_bids").insert({
      auction_id: auctionId,
      advertiser_id: user!.id,
      duration,
      amount: numAmount,
      banner_image_url: bannerImageUrl.trim() || null,
      target_url: targetUrl.trim(),
    });

    setSubmitting(false);

    if (bidError) {
      setError("صار خطأ بتقديم العرض: " + bidError.message);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl card-shadow p-10">
          <h1 className="text-xl font-bold text-primary mb-3">تم تقديم عرضك ✅</h1>
          <p className="text-gray-500 mb-6">
            المزايدة تُغلق قبل 48 ساعة من يوم العرض. لو فزت، بيتفعّل البنر تلقائياً — وقد يخضع لمراجعة إدارة الموقع قبل التفعيل النهائي.
          </p>
          <Link href="/" className="text-primary underline font-bold">← الرجوع للرئيسية</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-primary mb-2 text-center">أعلن على بالساعة</h1>
      <p className="text-gray-500 text-sm mb-6 text-center">
        قدّم عرضك على مكان بنر مميز. المزاد يُحسم قبل 48 ساعة من يوم العرض — الأغلبية بالمدة، ثم الأعلى سعراً ضمنها.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl card-shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 text-center">{error}</div>
        )}

        <div>
          <label className="block font-bold text-primary mb-2">مكان البنر</label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
          >
            {PLACEMENTS.map((p) => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-primary mb-2">مدة العرض</label>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((d) => (
              <button
                type="button"
                key={d.key}
                onClick={() => setDuration(d.key)}
                className={`rounded-xl py-2 text-sm font-bold border transition ${
                  duration === d.key
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold text-primary mb-2">مبلغ العرض ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            dir="ltr"
            placeholder="مثلاً: 20"
          />
        </div>

        <div>
          <label className="block font-bold text-primary mb-2">رابط صورة البنر (اختياري الآن)</label>
          <input
            type="url"
            value={bannerImageUrl}
            onChange={(e) => setBannerImageUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            dir="ltr"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block font-bold text-primary mb-2">رابط الوجهة عند الضغط على البنر</label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            dir="ltr"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white rounded-xl py-3 font-bold disabled:opacity-50"
        >
          {submitting ? "جاري التقديم..." : "قدّم عرضك"}
        </button>
      </form>
    </main>
  );
}
