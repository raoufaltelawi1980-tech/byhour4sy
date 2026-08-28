import Link from "next/link";
import { supabase } from "@/lib/supabase";

const sectionNames: Record<string, string> = {
  wanted: "مطلوب",
  offered: "معروض",
  for_sale: "للبيع",
  for_buy: "للشراء",
  jobs: "وظائف",
};

export default async function SectionPage({
  params,
}: {
  params: { key: string };
}) {
  const { key } = params;
  const name = sectionNames[key] ?? key;

  const { data: ads } = await supabase
    .from("ads")
    .select("id, title, price, price_note, created_at, categories(name_ar), regions(name_ar)")
    .eq("section", key)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-primary underline text-sm mb-4 inline-block">
        ← الرجوع للرئيسية
      </Link>

      <h1 className="text-2xl font-bold text-primary mb-8">{name}</h1>

      {!ads || ads.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center card-shadow">
          <p className="text-gray-500 mb-2">لا توجد إعلانات بقسم "{name}" حالياً.</p>
          <p className="text-sm text-gray-400 mb-4">كن أول من ينشر هنا!</p>
          <Link
            href="/post"
            className="bg-primary text-white rounded-xl px-6 py-3 font-bold inline-block"
          >
            + أضف إعلان
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ads.map((ad: any) => (
            <div key={ad.id} className="bg-white rounded-2xl p-4 card-shadow">
              <h3 className="font-bold text-primary mb-1">{ad.title}</h3>
              <p className="text-xs text-gray-400 mb-2">
                {ad.categories?.name_ar} · {ad.regions?.name_ar}
              </p>
              <p className="text-sm text-gray-600">
                {ad.price_note || (ad.price ? `${ad.price} $` : "السعر غير محدد")}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
