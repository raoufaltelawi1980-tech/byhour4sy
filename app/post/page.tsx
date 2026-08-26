import Link from "next/link";

export default function PostPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl card-shadow p-10">
        <h1 className="text-2xl font-bold text-primary mb-3">
          نموذج نشر الإعلان قريباً
        </h1>
        <p className="text-gray-500 mb-6">
          نعمل حالياً على بناء صفحة نشر الإعلانات والخدمات — ترقّب!
        </p>
        <Link href="/" className="text-primary underline font-bold">
          ← الرجوع للرئيسية
        </Link>
      </div>
    </main>
  );
}
