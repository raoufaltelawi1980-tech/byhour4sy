"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Category = {
  key: string;
  name: string;
  description: string;
};

const categories: Category[] = [
  {
    key: "real_estate",
    name: "عقارات",
    description: "بيع وشراء وتأجير البيوت والأراضي والمحلات في كل المناطق.",
  },
  {
    key: "health_care",
    name: "صحة ورعاية",
    description: "خدمات طبية، رعاية صحية، وأدوات ومعدات طبية.",
  },
  {
    key: "commercial",
    name: "تجاري",
    description: "عروض تجارية، محلات، بضائع وتجارة بكل أنواعها.",
  },
  {
    key: "vehicles",
    name: "سيارات وآليات",
    description: "سيارات، شاحنات، دراجات، آليات ثقيلة وقطع غيار.",
  },
  {
    key: "general_services",
    name: "خدمات عامة",
    description: "كهرباء، سباكة، نقل، تنظيف وأي خدمة يومية بتحتاجها.",
  },
  {
    key: "agriculture",
    name: "زراعي",
    description: "منتجات ومعدات زراعية، مواشي ومستلزمات المزارع.",
  },
  {
    key: "industrial",
    name: "صناعي",
    description: "معدات ومستلزمات صناعية وخدمات المصانع والورش.",
  },
  {
    key: "donation",
    name: "تبرع وكفالة",
    description: "تبرعات وكفالات إنسانية — بدون أي عمولة على الإطلاق.",
  },
];

export default function CategoryGrid() {
  const router = useRouter();
  const [active, setActive] = useState<Category | null>(null);

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c)}
            className="bg-white rounded-2xl overflow-hidden card-shadow hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-right"
          >
            <div className="relative w-full aspect-square p-4">
              <Image
                src={`/images/categories/${c.key}.png`}
                alt={c.name}
                fill
                className="object-contain p-3"
              />
            </div>
            <div className="w-full text-center pb-4 -mt-2">
              <span className="text-base font-bold text-primary">{c.name}</span>
            </div>
          </button>
        ))}
      </section>

      {active && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={`/images/categories/${active.key}.png`}
                alt={active.name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{active.name}</h3>
            <p className="text-gray-600 text-sm mb-6">{active.description}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push(`/category/${active.key}`)}
                className="bg-primary text-white rounded-xl py-3 font-bold"
              >
                تصفح إعلانات {active.name}
              </button>
              <button
                onClick={() => setActive(null)}
                className="text-gray-500 text-sm underline"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
