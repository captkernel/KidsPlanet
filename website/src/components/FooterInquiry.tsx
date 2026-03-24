"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";

export function FooterInquiry() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_KEY_HERE");
    data.append("subject", "Quick Inquiry — Kids Planet Website Footer");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      if (res.ok) { setSubmitted(true); form.reset(); }
    } catch { /* handled below */ } finally { setLoading(false); }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-white/80">
        <CheckCircle size={18} className="text-accent" />
        <span className="text-sm">Thank you! We&apos;ll call you shortly.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-white/80 mb-2">
        Quick inquiry — we&apos;ll call you back within hours.
      </p>
      <input
        type="text"
        name="parent_name"
        required
        placeholder="Your name"
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
      <input
        type="tel"
        name="phone"
        required
        placeholder="Phone number"
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
      <select
        name="child_class"
        required
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        <option value="" className="text-black">Child&apos;s class</option>
        <option value="Playgroup" className="text-black">Playgroup</option>
        <option value="Nursery" className="text-black">Nursery</option>
        <option value="KG" className="text-black">KG</option>
        <option value="Class 1-5" className="text-black">Class 1–5</option>
        <option value="Class 6-8" className="text-black">Class 6–8</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-accent text-primary-dark py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-light transition-colors disabled:opacity-50"
      >
        <Send size={14} />
        {loading ? "Sending..." : "Request a Callback"}
      </button>
    </form>
  );
}

export default FooterInquiry;
