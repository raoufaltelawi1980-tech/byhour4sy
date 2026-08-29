import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const categoryNames: Record<string, string> = {
  real_estate: "عقارات",
  health_care: "صحة ورعاية",
  commercial: "تجاري",
  vehicles: "سيارات وآليات",
  general_services: "خدمات عامة",
  agriculture: "زراعي",
  industrial: "صناعي",
  donation: "تبرع وكفالة",
};

export default async function CategoryPage({
  params,
}: {
  params: { key: string };
}) {
  const { key } = params;
  const name = categoryNames[key] ?? key;

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("key", key)
    .single();

  let ads: any[] = [];
  if (category) {
    const { data } = await supabase
      .from("ads")
      .select("id, title, description, price, price_note, created_at")
      .eq("category_id", category.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });
    ads = data ?? [];
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-primary underline text-sm mb-4 inline-block">
        ← الرجوع للرئيسية
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-16 h-16 shrink-0">
          <Image
            src={`/images/categories/${key}.png`}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-primary">{name}</h1>
      </div>

      {ads.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center card-shadow">
          <p className="text-gray-500 mb-2">لا توجد إعلانات في هذا القسم حالياً.</p>
          <p className="text-sm text-gray-400">كن أول من ينشر إعلاناً هنا!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <Link
              key={ad.id}
              href={`/ad/${ad.id}`}
              className="block bg-white rounded-2xl p-4 card-shadow hover:-translate-y-0.5 transition"
            >
              <h3 className="font-bold text-primary mb-1">{ad.title}</h3>
              {ad.description && (
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {ad.description}
                </p>
              )}
              <p className="text-sm text-gray-600 font-bold">
                {ad.price_note || (ad.price ? `${ad.price} $` : "السعر غير محدد")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
