import PageHeader from "@/components/PageHeader";
import { Globe, ExternalLink, FileText, Image, MessageCircle, HelpCircle, Trophy, Users } from "lucide-react";
import Link from "next/link";

const contentSections = [
  { name: "Announcements", file: "announcements.json", count: 3, icon: MessageCircle, desc: "School notices and updates" },
  { name: "Programs", file: "programs.json", count: 6, icon: FileText, desc: "Academic programs data" },
  { name: "Testimonials", file: "testimonials.json", count: 3, icon: MessageCircle, desc: "Parent reviews" },
  { name: "Gallery", file: "gallery.json", count: 6, icon: Image, desc: "Photo gallery metadata" },
  { name: "Faculty", file: "faculty.json", count: 8, icon: Users, desc: "Teacher profiles" },
  { name: "FAQ", file: "faq.json", count: 20, icon: HelpCircle, desc: "Frequently asked questions" },
  { name: "Achievements", file: "achievements.json", count: 10, icon: Trophy, desc: "School milestones" },
  { name: "Daily Schedule", file: "daily-schedule.json", count: 3, icon: FileText, desc: "Class routines" },
];

export default function WebsitePage() {
  return (
    <>
      <PageHeader
        title="Website Manager"
        subtitle="Manage content for kidsplanetkullu.com"
        actions={
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
            <ExternalLink size={16} /> Preview Website
          </a>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card text-center">
          <Globe size={32} className="text-primary mx-auto mb-3" />
          <div className="text-2xl font-bold text-primary-dark">11</div>
          <div className="text-xs text-text-muted">Total Pages</div>
        </div>
        <div className="card text-center">
          <FileText size={32} className="text-accent mx-auto mb-3" />
          <div className="text-2xl font-bold text-primary-dark">30</div>
          <div className="text-xs text-text-muted">Components</div>
        </div>
        <div className="card text-center">
          <Image size={32} className="text-info mx-auto mb-3" />
          <div className="text-2xl font-bold text-primary-dark">9</div>
          <div className="text-xs text-text-muted">Content Files</div>
        </div>
      </div>

      <h2 className="font-bold text-primary-dark mb-4">Content Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.name} className="card !p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-primary-dark">{section.name}</div>
                  <div className="text-xs text-text-muted">{section.count} items · {section.file}</div>
                </div>
              </div>
              <button className="btn-secondary text-xs">Edit</button>
            </div>
          );
        })}
      </div>

      <div className="card mt-6">
        <h2 className="font-bold text-primary-dark mb-3">Website Pages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {["Home", "About", "Programs", "Daily Life", "Faculty", "Achievements", "Admissions", "Gallery", "Announcements", "FAQ", "Contact"].map((page) => (
            <div key={page} className="flex items-center gap-2 p-2 rounded-lg bg-surface-cream text-sm text-text-light">
              <div className="w-2 h-2 rounded-full bg-success" />
              {page}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
