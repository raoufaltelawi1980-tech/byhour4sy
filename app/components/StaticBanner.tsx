import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function StaticBanner({ placementCode }: { placementCode: string }) {
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("banner_auctions")
    .select(
      "display_start, status, banner_placements!inner(code), banner_bids!banner_auctions_winning_bid_fkey(banner_image_url, target_url, duration)"
    )
    .eq("banner_placements.code", placementCode)
    .eq("status", "awarded")
    .lte("display_start", today)
    .order("display_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  const bid: any = data?.banner_bids;

  if (!bid?.banner_image_url) {
    // بنر افتراضي ترويجي للمنصة نفسها (مكان فاضي = ترويج ذاتي بدل فراغ)
    return (
      <Link
        href="/advertise"
        className="block bg-primary text-white rounded-2xl p-4 text-center card-shadow hover:opacity-90 transition"
      >
        <span className="font-bold">هذا المكان متاح للإعلان</span>
        <span className="text-sm opacity-90 block">أعلن هنا وصل لآلاف الزوار — اضغط للتفاصيل</span>
      </Link>
    );
  }

  return (
    <Link href={bid.target_url ?? "#"} target="_blank" className="block rounded-2xl overflow-hidden card-shadow">
      <div className="relative w-full aspect-[4/1] bg-gray-100">
        <Image src={bid.banner_image_url} alt="بنر إعلاني" fill className="object-cover" />
      </div>
    </Link>
  );
}
