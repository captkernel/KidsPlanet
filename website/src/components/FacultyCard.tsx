import { Briefcase, GraduationCap } from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  experience: string;
  initials: string;
  bio: string;
  featured: boolean;
}

export function FacultyCard({ member }: { member: FacultyMember }) {
  return (
    <div className={`card-static ${member.featured ? "ring-2 ring-primary/20 bg-primary/[0.02]" : ""}`}>
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
            member.featured
              ? "bg-primary text-white shadow-sm"
              : "bg-primary/10 text-primary"
          }`}
        >
          <span className="text-lg font-bold">{member.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-primary-dark">{member.name}</h3>
          <p className="text-sm text-accent-dark font-semibold">{member.designation}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-xs bg-surface-muted text-primary px-2.5 py-1 rounded-full">
              <GraduationCap className="h-3 w-3" />
              {member.qualification}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-surface-muted text-text-muted px-2.5 py-1 rounded-full">
              <Briefcase className="h-3 w-3" />
              {member.experience}
            </span>
          </div>
          <p className="text-sm text-text-light mt-3 leading-relaxed">
            {member.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FacultyCard;
