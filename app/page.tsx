import Image from "next/image";
import CategoryGrid from "@/app/components/CategoryGrid";

const sections = [
  { name: "مطلوب", desc: "اطلب الخدمة اللي بدك ياها", color: "bg-primary" },
  { name: "معروض", desc: "قدّم خدمتك للناس", color: "bg-primary-light" },
  { name: "للبيع", desc: "بيع أغراضك بسهولة", color: "bg-accent" },
  { name: "للشراء", desc: "دور على اللي بدك تشتريه", color: "bg-primary" },
  { name: "وظائف", desc: "دور على شغل أو موظف", color: "bg-primary-light" },
];

export default function Home() {
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
          <input
            type="text"
            placeholder="🔍 ماذا تبحث عنه؟"
            className="flex-1 px-4 py-3 rounded-xl outline-none text-right"
          />
          <select className="px-4 py-3 rounded-xl outline-none text-gray-600 bg-gray-50 sm:w-40">
            <option>📍 اختر المدينة</option>
            <option>دمشق</option>
            <option>حلب</option>
            <option>حمص</option>
            <option>اللاذقية</option>
            <option>درعا</option>
          </select>
          <button
            type="submit"
            className="bg-primary text-white rounded-xl px-6 py-3 font-bold hover:opacity-90 transition"
          >
            بحث
          </button>
        </form>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {sections.map((s) => (
          <button
            key={s.name}
            className={`${s.color} text-white rounded-2xl p-5 text-center card-shadow hover:opacity-90 transition`}
          >
            <div className="text-lg font-bold mb-1">{s.name}</div>
            <div className="text-xs opacity-90">{s.desc}</div>
          </button>
        ))}
      </section>

      <section id="categories">
        <h2 className="text-xl font-bold text-primary mb-4">تصفح حسب التصنيف</h2>
        <CategoryGrid />
      </section>
    </main>
  );
}
