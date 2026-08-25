import Image from "next/image";

const sections = [
  { name: "مطلوب", desc: "اطلب الخدمة اللي بدك ياها", color: "bg-primary" },
  { name: "معروض", desc: "قدّم خدمتك للناس", color: "bg-primary-light" },
  { name: "للبيع", desc: "بيع أغراضك بسهولة", color: "bg-accent" },
  { name: "للشراء", desc: "دور على اللي بدك تشتريه", color: "bg-primary" },
  { name: "وظائف", desc: "دور على شغل أو موظف", color: "bg-primary-light" },
];

const categories = [
  { key: "real_estate", name: "عقارات" },
  { key: "health_care", name: "صحة ورعاية" },
  { key: "commercial", name: "تجاري" },
  { key: "vehicles", name: "سيارات وآليات" },
  { key: "general_services", name: "خدمات عامة" },
  { key: "agriculture", name: "زراعي" },
  { key: "industrial", name: "صناعي" },
  { key: "donation", name: "تبرع وكفالة" },
];

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col items-center text-center mb-10">
        <Image
          src="/images/logo-new.png?v=4"
          alt="شعار بالساعة"
          width={260}
          height={152}
          priority
        />
        <p className="text-primary/80 mt-2 font-medium">
          خدمات سوريا.. بلمسة واحدة — ابحث · اختر · احجز · أنجز
        </p>
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

      <section>
        <h2 className="text-xl font-bold text-primary mb-4">تصفح حسب التصنيف</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div
              key={c.key}
              className="bg-white rounded-2xl overflow-hidden card-shadow hover:-translate-y-1 transition cursor-pointer"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={`/images/categories/${c.key}.png`}
                  alt={c.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
