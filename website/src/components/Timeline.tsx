import FadeIn from "@/components/FadeIn";

const milestones = [
  {
    year: "2010",
    title: "A Dream Takes Shape",
    description:
      "Mrs. Neeta Parmar founded Kids Planet in Kullu — the valley's first dedicated preschool — starting with a small group of children and a big vision for quality early education.",
  },
  {
    year: "2013",
    title: "Growing With the Community",
    description:
      "Added Classes 1–5, responding to parents who didn't want their children to leave the Kids Planet family. The school joined Facebook to connect with Kullu Valley families.",
  },
  {
    year: "2018",
    title: "Full K–8 School",
    description:
      "Extended to Class 8 with HP State Board (HPBOSE) affiliation. First batch of Class 8 graduates received a heartfelt farewell — a tradition that continues every year.",
  },
  {
    year: "2023",
    title: "Art & Craft Exhibition",
    description:
      "Hosted the grand Kids Planet Art & Craft Exhibition, showcasing student creativity in science models, handmade crafts, and artwork — attended by parents and community members.",
  },
  {
    year: "2024",
    title: "15 Years & Community Events",
    description:
      "Celebrated 15 years of excellence. Hosted the Kids Planet Fete, celebrated International Yoga Day with the entire school, and organized Children's Day with costume competitions and performances.",
  },
  {
    year: "2026",
    title: "Featured in Amar Ujala",
    description:
      "Kids Planet's Annual Function was covered by Amar Ujala newspaper — 'Students Added Colour To The Annual Function.' 200+ families now trust Kids Planet with their children's future.",
  },
];

export default function Timeline() {
  return (
    <div className="relative mx-auto max-w-2xl">
      {/* Vertical connecting line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 md:left-1/2 md:-translate-x-px" />

      {milestones.map((milestone, i) => (
        <FadeIn key={milestone.year} delay={i * 0.15}>
          <div className="relative mb-12 last:mb-0 pl-16 md:pl-0">
            {/* Green circle with year */}
            <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xs font-bold text-white md:left-1/2 md:-translate-x-1/2">
              {milestone.year}
            </div>

            {/* Content — alternates sides on md+ */}
            <div
              className={`md:w-[calc(50%-2rem)] ${
                i % 2 === 0
                  ? "md:ml-[calc(50%+2rem)]"
                  : "md:mr-[calc(50%+2rem)]"
              }`}
            >
              <h3 className="text-lg font-bold text-primary-dark">
                {milestone.title}
              </h3>
              <p className="mt-1 text-sm text-text-light leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
