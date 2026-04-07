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
    quote: "When Aarav joined us at age 3, he couldn't sit still for even five minutes. His parents were worried he'd never adjust to a classroom.",
    achievement: "Today he leads morning assembly in the courtyard, performs in our Annual Day cultural program, and was selected as House Captain. His teachers say he's the first one to help a new student feel welcome.",
  },
  {
    name: "Priya",
    joinedClass: "Nursery",
    currentClass: "Class 4",
    quote: "Priya's parents almost didn't enroll her — she would cry every time they left. Our preschool teachers spent the first week simply building trust through stories and play.",
    achievement: "Now she's the art champion of her class, won prizes at the Art & Craft Exhibition, and creates handmade cards for every festival. She runs to school every morning.",
  },
  {
    name: "Rohan",
    joinedClass: "Class 1",
    currentClass: "Class 7",
    quote: "Rohan transferred from another school where large class sizes meant he was invisible. He had lost interest in studies and wouldn't participate in anything.",
    achievement: "At Kids Planet, he discovered a love for science through hands-on experiments and won first prize at our Science Exhibition. He now dreams of becoming an engineer and helps younger students build science models.",
  },
  {
    name: "Ananya",
    joinedClass: "LKG",
    currentClass: "Class 8",
    quote: "Ananya was so timid she wouldn't raise her hand even when she knew the answer. Her parents thought she just wasn't a confident child.",
    achievement: "This year she performed a classical dance at the farewell ceremony, was elected Vice Captain, and scored among the top in her HPBOSE Class 8 exams. Her farewell speech brought tears to everyone's eyes.",
  },
];

export function TransformationStories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
