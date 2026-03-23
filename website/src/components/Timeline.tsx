import FadeIn from "@/components/FadeIn";

const milestones = [
  {
    year: "2010",
    title: "Founded",
    description:
      "Mrs. Neeta Parmar established Kids Planet in Kullu with a vision to provide quality education from the earliest years.",
  },
  {
    year: "2013",
    title: "Expanded to Primary",
    description:
      "Added Classes 1–5 to the curriculum, growing from a pre-school into a full primary institution.",
  },
  {
    year: "2018",
    title: "Middle School Added",
    description:
      "Extended to Class 8 with HP State Board (HPBOSE) affiliation, offering a complete K-8 education.",
  },
  {
    year: "2024",
    title: "15 Years of Excellence",
    description:
      "Celebrated 15 years of nurturing young minds in Kullu Valley, with hundreds of alumni and a trusted reputation.",
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
