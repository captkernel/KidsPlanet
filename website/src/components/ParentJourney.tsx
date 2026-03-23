import { MessageCircle, School, FileCheck, PartyPopper } from "lucide-react";
import FadeIn from "./FadeIn";

const steps = [
  {
    icon: MessageCircle,
    title: "You Reach Out",
    description: "Send us a WhatsApp message or fill out the inquiry form. We reply within minutes — not days.",
    time: "Day 1",
  },
  {
    icon: School,
    title: "Visit Our Campus",
    description: "Walk through our classrooms, meet the teachers, and see your child's future learning environment firsthand.",
    time: "Day 2–3",
  },
  {
    icon: FileCheck,
    title: "Simple Paperwork",
    description: "Submit basic documents — birth certificate, Aadhar, photos. No entrance tests for pre-school. We keep it simple.",
    time: "Day 3–5",
  },
  {
    icon: PartyPopper,
    title: "Welcome to the Family!",
    description: "Your child is officially a Kids Planet student. You'll receive the welcome kit, class schedule, and join our parent WhatsApp group.",
    time: "Day 5–7",
  },
];

export function ParentJourney() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-0">
        {steps.map((step, i) => (
          <FadeIn key={step.title} delay={i * 0.1}>
            <div className="flex gap-5 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <step.icon size={20} />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-primary/20 mt-2" />
                )}
              </div>
              <div className="pt-1">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  {step.time}
                </span>
                <h3 className="font-bold text-primary-dark mt-1">{step.title}</h3>
                <p className="text-sm text-text-light mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

export default ParentJourney;
