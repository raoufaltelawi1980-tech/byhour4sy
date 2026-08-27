"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

const SECTIONS = [
  { key: "wanted", name: "مطلوب" },
  { key: "offered", name: "معروض" },
  { key: "for_sale", name: "للبيع" },
  { key: "for_buy", name: "للشراء" },
  { key: "jobs", name: "وظائف" },
];

const CATEGORIES = [
  { id: null as number | null, key: "real_estate", name: "عقارات" },
  { id: null as number | null, key: "health_care", name: "صحة ورعاية" },
  { id: null as number | null, key: "commercial", name: "تجاري" },
  { id: null as number | null, key: "vehicles", name: "سيارات وآليات" },
  { id: null as number | null, key: "general_services", name: "خدمات عامة" },
  { id: null as number | null, key: "agriculture", name: "زراعي" },
  { id: null as number | null, key: "industrial", name: "صناعي" },
  { id: null as number | null, key: "donation", name: "تبرع وكفالة" },
];

function calcCommission(section: string, categoryKey: string, price: number) {
  if (categoryKey === "donation") return { rate: "0%", amount: 0, note: "لا عمولة على التبرعات" };
  if (section === "jobs") return { rate: "5$ ثابتة", amount: 5, note: "يدفعها صاحب العمل" };
  if (section === "wanted" || section === "offered") {
    const amount = Math.max(price * 0.07, 0);
    return { rate: "7%", amount, note: "عمولة الخدمات" };
  }
  // for_sale / for_buy
  if (price > 0 && price < 15) {
    const amount = Math.max(price * 0.15, 0.25);
    return { rate: "15%", amount, note: "حد أدنى 0.25$ للصفقات الصغيرة" };
  }
  const amount = Math.max(price * 0.01, 1);
  return { rate: "1%", amount, note: "حد أدنى 1$" };
}

export default function PostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [categories, setCategories] = useState(CATEGORIES);
  const [regions, setRegions] = useState<{ id: number; name_ar: string }[]>([]);

  const [section, setSection] = useState("offered");
  const [categoryKey, setCategoryKey] = useState("general_services");
  const [regionId, setRegionId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceMode, setPriceMode] = useState<"fixed" | "negotiable" | "onrequest">("fixed");
  const [price, setPrice] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, key, name_ar")
      .then(({ data }) => {
        if (data) {
          setCategories(
            CATEGORIES.map((c) => {
              const match = data.find((d: any) => d.key === c.key);
              return { ...c, id: match ? match.id : null, name: match?.name_ar ?? c.name };
            })
          );
        }
      });
    supabase
      .from("regions")
      .select("id, name_ar")
      .order("id")
      .then(({ data }) => {
        if (data) setRegions(data);
      });
  }, []);

  const numericPrice = parseFloat(price) || 0;
  const commission = useMemo(
    () => calcCommission(section, categoryKey, priceMode === "fixed" ? numericPrice : 0),
    [section, categoryKey, numericPrice, priceMode]
  );

  if (!loading && !user) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl card-shadow p-10">
          <h1 className="text-xl font-bold text-primary mb-3">
            لازم تسجل دخول أول
          </h1>
          <p className="text-gray-500 mb-6">
            نشر إعلان أو خدمة يحتاج حساب مسجّل بالمنصة.
          </p>
          <Link
            href="/login"
            className="bg-primary text-white rounded-xl px-6 py-3 font-bold inline-block"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("لازم تكتب عنوان للإعلان.");
      return;
    }
    if (!regionId) {
      setError("لازم تختار المنطقة.");
      return;
    }
    const cat = categories.find((c) => c.key === categoryKey);
    if (!cat?.id) {
      setError("صار خطأ بتحميل التصنيفات، جرب تحدّث الصفحة.");
      return;
    }

    let priceValue: number | null = null;
    let priceNote: string | null = null;
    if (priceMode === "fixed") {
      priceValue = numericPrice || null;
    } else if (priceMode === "negotiable") {
      priceNote = "قابل للتفاوض";
    } else {
      priceNote = "حسب العرض";
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("ads").insert({
      owner_id: user!.id,
      section,
      category_id: cat.id,
      region_id: regionId,
      title: title.trim(),
      description: description.trim() || null,
      price: priceValue,
      price_note: priceNote,
    });
    setSubmitting(false);

    if (insertError) {
      setError("صار خطأ بنشر الإعلان، جرب مرة تانية.");
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl card-shadow p-10">
          <h1 className="text-xl font-bold text-primary mb-3">
            تم نشر إعلانك ✅
          </h1>
          <p className="text-gray-500 mb-6">
            إعلانك ظاهر الآن بالتصنيف يلي اخترته لمدة 24 ساعة.
          </p>
          <Link href="/" className="text-primary underline font-bold">
            ← الرجوع للرئيسية
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        أضف إعلان أو خدمة
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl card-shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        {/* القسم */}
        <div>
          <label className="block font-bold text-primary mb-2">القسم</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {SECTIONS.map((s) => (
              <button
                type="button"
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`rounded-xl py-2 text-sm font-bold border transition ${
                  section === s.key
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* التصنيف */}
        <div>
          <label className="block font-bold text-primary mb-2">التصنيف</label>
          <select
            value={categoryKey}
            onChange={(e) => setCategoryKey(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* المنطقة */}
        <div>
          <label className="block font-bold text-primary mb-2">المنطقة</label>
          <select
            value={regionId}
            onChange={(e) => setRegionId(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
          >
            <option value="">اختر المحافظة</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name_ar}
              </option>
            ))}
          </select>
        </div>

        {/* العنوان */}
        <div>
          <label className="block font-bold text-primary mb-2">العنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: أحتاج كهربائي لتركيب لوحة منزلية"
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            maxLength={120}
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="block font-bold text-primary mb-2">التفاصيل (اختياري)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            placeholder="اكتب تفاصيل أكثر عن اللي بتحتاجه أو بتعرضه..."
          />
        </div>

        {/* السعر */}
        <div>
          <label className="block font-bold text-primary mb-2">السعر</label>
          <div className="flex gap-2 mb-3">
            {[
              { key: "fixed", label: "سعر محدد" },
              { key: "negotiable", label: "قابل للتفاوض" },
              { key: "onrequest", label: "حسب العرض" },
            ].map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setPriceMode(m.key as any)}
                className={`flex-1 rounded-xl py-2 text-sm font-bold border transition ${
                  priceMode === m.key
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {priceMode === "fixed" && (
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="السعر بالدولار"
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
              dir="ltr"
            />
          )}
        </div>

        {/* حاسبة العمولة */}
        {section !== "jobs" && priceMode === "fixed" && numericPrice > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
            <div className="font-bold text-primary mb-1">حاسبة العمولة</div>
            <div className="flex justify-between text-gray-600">
              <span>السعر</span>
              <span>{numericPrice.toFixed(2)} $</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>عمولة المنصة ({commission.rate})</span>
              <span>{commission.amount.toFixed(2)} $</span>
            </div>
            <div className="flex justify-between font-bold text-primary border-t border-primary/20 mt-2 pt-2">
              <span>المبلغ الذي ستستلمه</span>
              <span>{Math.max(numericPrice - commission.amount, 0).toFixed(2)} $</span>
            </div>
          </div>
        )}
        {section === "jobs" && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-gray-600">
            عمولة الوظائف: <span className="font-bold text-primary">5$ ثابتة</span> يدفعها صاحب العمل عند التوظيف.
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          صور الإعلان قريباً — حالياً ينشر الإعلان بدون صور، بيبقى ظاهر 24 ساعة.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white rounded-xl py-3 font-bold disabled:opacity-50"
        >
          {submitting ? "جاري النشر..." : "نشر الإعلان"}
        </button>
      </form>
    </main>
  );
}
