"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type BannerItem = {
  image: string;
  target: string;
};

export default function RotatingBanner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("banner_auctions")
      .select("banner_bids!banner_auctions_winning_bid_fkey(banner_image_url, target_url)")
      .eq("status", "awarded")
      .lte("display_start", today)
      .then(({ data }) => {
        const items = (data ?? [])
          .map((row: any) => row.banner_bids)
          .filter((b: any) => b?.banner_image_url)
          .map((b: any) => ({ image: b.banner_image_url, target: b.target_url }));
        setBanners(items);
      });
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(t);
  }, [banners]);

  if (banners.length === 0) {
    return (
      <a
        href="/advertise"
        className="block bg-primary-light text-white rounded-2xl p-4 text-center card-shadow hover:opacity-90 transition"
      >
        <span className="font-bold">مساحة إعلانية متاحة هنا</span>
        <span className="text-sm opacity-90 block">قدّم عرضك الآن عبر نظام المزاد</span>
      </a>
    );
  }

  const current = banners[index];

  return (
    <a
      href={current.target || "#"}
      target="_blank"
      className="block relative w-full aspect-[4/1] rounded-2xl overflow-hidden card-shadow"
    >
      <Image
        key={current.image}
        src={current.image}
        alt="بنر إعلاني متحرك"
        fill
        className="object-cover transition-opacity duration-700"
      />
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </a>
  );
}
