"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_KEY_HERE");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card text-center py-12">
        <CheckCircle size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-primary-dark">Thank You!</h3>
        <p className="text-text-muted mt-2">
          We&apos;ve received your inquiry. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <AlertCircle size={48} className="text-error mx-auto mb-4" />
        <h3 className="text-xl font-bold text-primary-dark">Submission Failed</h3>
        <p className="text-text-muted mt-2">
          Please call us at +91 94180 23454 or message us on WhatsApp.
        </p>
        <button
          onClick={() => setError(false)}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <input type="hidden" name="subject" value="New Admission Inquiry — Kids Planet Website" />

      <div>
        <label htmlFor="parent_name" className="block text-sm font-semibold text-primary-dark mb-1">
          Parent Name
        </label>
        <input
          type="text"
          id="parent_name"
          name="parent_name"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-primary-dark mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div>
        <label htmlFor="child_name" className="block text-sm font-semibold text-primary-dark mb-1">
          Child&apos;s Name
        </label>
        <input
          type="text"
          id="child_name"
          name="child_name"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          placeholder="Child's full name"
        />
      </div>

      <div>
        <label htmlFor="class" className="block text-sm font-semibold text-primary-dark mb-1">
          Class Applying For
        </label>
        <select
          id="class"
          name="class"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        >
          <option value="">Select class</option>
          <option value="Playgroup">Playgroup</option>
          <option value="Nursery">Nursery</option>
          <option value="LKG">LKG</option>
          <option value="UKG">UKG</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
          <option value="Class 4">Class 4</option>
          <option value="Class 5">Class 5</option>
          <option value="Class 6">Class 6</option>
          <option value="Class 7">Class 7</option>
          <option value="Class 8">Class 8</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-primary-dark mb-1">
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
          placeholder="Any questions or additional information..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send size={16} />
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}

export default InquiryForm;
