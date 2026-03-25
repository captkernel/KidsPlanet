import PageHeader from "@/components/PageHeader";
import { UserPlus } from "lucide-react";

const staff = [
  { name: "Mrs. Neeta Parmar", role: "Founder & Principal", qualification: "M.A., B.Ed.", experience: "25+ years", initials: "NP", featured: true },
  { name: "Mrs. Sunita Sharma", role: "Vice Principal", qualification: "M.Sc., B.Ed.", experience: "15+ years", initials: "SS", featured: false },
  { name: "Mrs. Anita Thakur", role: "Pre-School Coordinator", qualification: "B.A., D.El.Ed.", experience: "12+ years", initials: "AT", featured: false },
  { name: "Mr. Rajesh Kumar", role: "Mathematics & Science", qualification: "M.Sc., B.Ed.", experience: "10+ years", initials: "RK", featured: false },
  { name: "Mrs. Priya Verma", role: "English & Social Studies", qualification: "M.A., B.Ed.", experience: "8+ years", initials: "PV", featured: false },
  { name: "Mrs. Meena Devi", role: "Hindi & Sanskrit", qualification: "M.A., B.Ed.", experience: "10+ years", initials: "MD", featured: false },
  { name: "Mr. Vikram Singh", role: "Sports & Physical Ed.", qualification: "B.P.Ed., M.P.Ed.", experience: "7+ years", initials: "VS", featured: false },
  { name: "Mrs. Kavita Rana", role: "Art & Craft", qualification: "B.F.A., D.El.Ed.", experience: "6+ years", initials: "KR", featured: false },
];

export default function StaffPage() {
  return (
    <>
      <PageHeader
        title="Staff Directory"
        subtitle={`${staff.length} faculty members`}
        actions={<button className="btn-primary flex items-center gap-2"><UserPlus size={16} /> Add Staff</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div key={member.name} className={`card ${member.featured ? "border-2 border-accent/30" : ""}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                member.featured ? "bg-primary text-white" : "bg-primary/10 text-primary"
              }`}>
                {member.initials}
              </div>
              <div>
                <div className="font-bold text-sm text-primary-dark">{member.name}</div>
                <div className="text-xs text-accent font-semibold">{member.role}</div>
                <div className="flex gap-2 mt-2">
                  <span className="badge bg-surface-cream text-primary">{member.qualification}</span>
                  <span className="badge bg-surface-cream text-text-muted">{member.experience}</span>
                </div>
              </div>
            </div>
            {member.featured && (
              <div className="mt-3 pt-3 border-t border-primary/10">
                <span className="badge bg-accent/10 text-accent-dark">Principal</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
