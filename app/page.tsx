import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "ScentMuse 香氛探索与试香产品 Demo，基于 Vercel Commerce。",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <p className="mb-4 text-xs tracking-[0.35em] text-neutral-500">SCENTMUSE / THE SCENT EDIT</p>
        <h1 className="mb-5 font-serif text-4xl leading-tight tracking-tight md:text-6xl">让气味，成为你的另一种表达。</h1>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><p className="max-w-lg text-sm leading-7 text-neutral-500">从花香到木质，从日常到特别时刻。探索香调、完成风格测评，先试香，再找到让自己心动的那一款。</p><a href="/quiz" className="w-fit rounded-full bg-black px-7 py-3 text-sm text-white dark:bg-white dark:text-black">开始我的气味探索 →</a></div>
      </section>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
