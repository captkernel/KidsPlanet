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
    <div className={`card ${member.featured ? "border-2 border-primary/20" : ""}`}>
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
            member.featured
              ? "bg-primary text-white"
              : "bg-primary/10 text-primary"
          }`}
        >
          <span className="text-lg font-bold">{member.initials}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-primary-dark">{member.name}</h3>
          <p className="text-sm text-accent font-semibold">{member.designation}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-surface-cream text-primary px-2 py-0.5 rounded-full">
              {member.qualification}
            </span>
            <span className="text-xs bg-surface-cream text-text-muted px-2 py-0.5 rounded-full">
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
