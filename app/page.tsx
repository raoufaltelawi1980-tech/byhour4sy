import Image from "next/image";
import Link from "next/link";
import CategoryGrid from "@/app/components/CategoryGrid";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const sections = [
  { key: "wanted", name: "مطلوب" },
  { key: "offered", name: "معروض" },
  { key: "for_sale", name: "للبيع" },
  { key: "for_buy", name: "للشراء" },
  { key: "jobs", name: "وظائف" },
];

export default async function Home() {
  const { data: latestAds } = await supabase
    .from("ads")
    .select("id, title, section, price, price_note, created_at, categories(name_ar), regions(name_ar)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col items-center text-center mb-8">
        <Image
          src="/images/logo-new.png?v=4"
          alt="شعار بالساعة"
          width={220}
          height={128}
          priority
        />
        <div className="flex items-center justify-between w-full max-w-xs mt-2 px-2" dir="ltr">
          <span className="text-2xl font-extrabold text-primary">By-Hour</span>
          <span className="text-2xl font-extrabold text-primary" dir="rtl">بالساعة</span>
        </div>
        <p className="text-primary font-bold mt-3 text-lg">
          خدمات سورية بلمسة واحدة
        </p>
        <p className="text-primary/90 font-bold mt-1">
          أضف اعلان أو خدمة أو أبحث ع أي شيء تحتاجه
        </p>

        <form className="w-full max-w-2xl mt-6 bg-white rounded-2xl card-shadow p-2 flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path
                d="M20 20L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="ماذا تبحث عنه؟"
              className="w-full pr-10 pl-4 py-3 rounded-xl outline-none text-right"
            />
          </div>

          <div className="relative sm:w-48">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="2" />
            </svg>
            <select className="w-full pr-10 pl-3 py-3 rounded-xl outline-none text-gray-600 bg-gray-50 appearance-none">
              <option>كل المحافظات</option>
              <option>دمشق</option>
              <option>ريف دمشق</option>
              <option>حلب</option>
              <option>حمص</option>
              <option>حماة</option>
              <option>اللاذقية</option>
              <option>طرطوس</option>
              <option>إدلب</option>
              <option>درعا</option>
              <option>السويداء</option>
              <option>القنيطرة</option>
              <option>دير الزور</option>
              <option>الرقة</option>
              <option>الحسكة</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-primary text-white rounded-xl px-6 py-3 font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
              <path
                d="M20 20L16.65 16.65"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            بحث
          </button>
        </form>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {sections.map((s) => (
          <Link
            key={s.key}
            href={`/section/${s.key}`}
            className="relative aspect-square rounded-2xl overflow-hidden card-shadow hover:-translate-y-1 transition block"
          >
            <Image
              src={`/images/sections/${s.key}.png`}
              alt={s.name}
              fill
              className="object-cover"
            />
          </Link>
        ))}
      </section>

      <section id="categories">
        <h2 className="text-xl font-bold text-primary mb-4">تصفح حسب التصنيف</h2>
        <CategoryGrid />
      </section>

      <section id="latest" className="mt-12">
        <h2 className="text-xl font-bold text-primary mb-4">أحدث الإعلانات</h2>
        {!latestAds || latestAds.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center card-shadow">
            <p className="text-gray-500">لا توجد إعلانات منشورة بعد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {latestAds.map((ad: any) => (
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
      </section>
    </main>
  );
}
