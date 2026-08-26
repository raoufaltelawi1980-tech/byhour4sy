import Image from "next/image";
import AuthButton from "@/app/components/AuthButton";
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
      <div className="flex justify-end mb-2">
        <AuthButton />
      </div>
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
        <CategoryGrid />
      </section>
    </main>
  );
}
