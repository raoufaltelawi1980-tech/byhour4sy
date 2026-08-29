import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function AdDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: ad } = await supabase
    .from("ads")
    .select(
      "id, title, description, price, price_note, section, created_at, categories(name_ar), subcategories(name_ar), regions(name_ar)"
    )
    .eq("id", params.id)
    .eq("status", "active")
    .single();

  if (!ad) {
    notFound();
  }

  const a: any = ad;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-primary underline text-sm mb-4 inline-block">
        ← الرجوع للرئيسية
      </Link>

      <div className="bg-white rounded-2xl card-shadow p-6">
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="bg-primary/10 text-primary rounded-full px-3 py-1 font-bold">
            {a.section}
          </span>
          {a.categories?.name_ar && (
            <span className="bg-gray-100 text-gray-600 rounded-full px-3 py-1">
              {a.categories.name_ar}
              {a.subcategories?.name_ar ? ` · ${a.subcategories.name_ar}` : ""}
            </span>
          )}
          {a.regions?.name_ar && (
            <span className="bg-gray-100 text-gray-600 rounded-full px-3 py-1">
              📍 {a.regions.name_ar}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-primary mb-4">{a.title}</h1>

        {a.description && (
          <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
            {a.description}
          </div>
        )}

        <div className="border-t pt-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {new Date(a.created_at).toLocaleDateString("ar-SY")}
          </span>
          <span className="font-bold text-lg text-primary">
            {a.price_note || (a.price ? `${a.price} $` : "السعر غير محدد")}
          </span>
        </div>
      </div>
    </main>
  );
}
