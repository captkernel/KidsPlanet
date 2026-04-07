import Link from "next/link";
import Image from "next/image";
import { SCHOOL } from "@/lib/constants";
import StatsBar from "@/components/StatsBar";
import { Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-surface-cream">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-0 text-center sm:px-6 md:pt-24 lg:px-8">
        {/* Social proof badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 border border-primary/10 px-4 py-1.5 rounded-full mb-6">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < 4 ? "fill-accent text-accent" : "fill-accent/40 text-accent/40"} />
            ))}
          </div>
          <span className="text-xs font-semibold text-primary-dark">
            Trusted by 200+ families in Kullu Valley
          </span>
        </div>

        {/* Emotional headline */}
        <h1 className="text-4xl font-bold text-primary-dark sm:text-5xl md:text-6xl leading-tight">
          Where Your Child&apos;s
          <br />
          <span className="text-primary">Brightest Future Begins</span>
        </h1>

        {/* Positioning + benefit subtitle */}
        <p className="mx-auto mt-4 max-w-xl text-sm font-semibold text-accent uppercase tracking-wider">
          Kullu Valley&apos;s dedicated early childhood learning center
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-light leading-relaxed">
          Imagine your child coming home excited to tell you what they learned today.
          At Kids Planet, we don&apos;t treat preschool as an afterthought — it&apos;s our
          entire mission. Small classrooms, personal attention, and a curriculum
          designed for how young children actually learn.
        </p>

        {/* CTAs with better wording */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/admissions" className="btn-primary text-base px-8 py-3.5">
            Reserve Your Child&apos;s Seat
          </Link>
          <Link href="/daily-life" className="btn-secondary text-base px-8 py-3.5">
            See a Day at Kids Planet
          </Link>
        </div>

        {/* Urgency line */}
        <p className="mt-4 text-xs text-error font-semibold">
          2026–27 admissions open — limited seats available
        </p>
      </div>

      {/* Hero image collage */}
      <div className="mt-12 mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden col-span-2 row-span-2">
            <Image
              src="/images/campus/morning-assembly.jpg"
              alt="Morning assembly at Kids Planet — students in uniform in the school courtyard"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/images/classroom/teacher-reading.jpg"
              alt="Teacher reading a story to preschool children"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/images/activities/planting-seedling.jpg"
              alt="Student planting a seedling — hands-on environmental learning"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/images/activities/outdoor-forest-learning.jpg"
              alt="Outdoor learning in a Kullu Valley pine forest"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/images/events/cultural-performance.jpg"
              alt="Student performing in traditional Himachali dress"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mt-12">
        <StatsBar />
      </div>
    </section>
  );
}
