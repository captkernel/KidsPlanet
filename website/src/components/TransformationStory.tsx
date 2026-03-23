import FadeIn from "./FadeIn";

interface Story {
  name: string;
  joinedClass: string;
  currentClass: string;
  quote: string;
  achievement: string;
}

const stories: Story[] = [
  {
    name: "Aarav",
    joinedClass: "Playgroup",
    currentClass: "Class 5",
    quote: "When Aarav joined us at age 3, he was shy and wouldn't speak in front of others.",
    achievement: "Today he leads morning assembly and won the district-level recitation competition.",
  },
  {
    name: "Priya",
    joinedClass: "Nursery",
    currentClass: "Class 4",
    quote: "Priya struggled with numbers when she first came to Kids Planet.",
    achievement: "Now she's the math champion of her class and helps her classmates with problem-solving.",
  },
  {
    name: "Rohan",
    joinedClass: "Class 1",
    currentClass: "Class 7",
    quote: "Rohan transferred from another school where he had lost interest in studies.",
    achievement: "At Kids Planet, he discovered a love for science and won first prize at our Science Exhibition.",
  },
];

export function TransformationStories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stories.map((story, i) => (
        <FadeIn key={story.name} delay={i * 0.15}>
          <div className="card h-full flex flex-col">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-primary">
                {story.name[0]}
              </span>
            </div>
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-surface-cream text-text-muted px-2 py-0.5 rounded-full">
                Joined: {story.joinedClass}
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Now: {story.currentClass}
              </span>
            </div>
            <p className="text-sm text-text-light italic mb-3 flex-1">
              &ldquo;{story.quote}&rdquo;
            </p>
            <p className="text-sm text-primary-dark font-semibold">
              {story.achievement}
            </p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

export default TransformationStories;
