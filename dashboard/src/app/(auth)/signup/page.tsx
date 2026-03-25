'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const DEFAULT_CLASSES = [
  'Playgroup', 'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4',
  'Class 5', 'Class 6', 'Class 7', 'Class 8',
]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Step 1: Admin account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  // Step 2: School info
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [schoolPhone, setSchoolPhone] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Signup failed')

      // IMPORTANT: Signup bootstrapping order matters for RLS.
      // School INSERT is open to all authenticated users (bootstrapping policy).
      // Profile INSERT requires user_id = auth.uid().
      // After profile exists, get_user_school_id() works for all subsequent queries.

      // 2. Create school (open INSERT policy for bootstrapping)
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: schoolName,
          address: schoolAddress,
          phone: schoolPhone,
          email: email,
        })
        .select()
        .single()

      if (schoolError) throw schoolError

      // 3. Create admin profile EARLY so get_user_school_id() works
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          school_id: school.id,
          full_name: fullName,
          phone: phone,
          roles: ['admin'],
          primary_role: 'admin',
        })

      if (profileError) throw profileError

      // 4. Now get_user_school_id() returns school.id

      // 5. Create academic year (April 2026 - March 2027)
      const { data: academicYear, error: yearError } = await supabase
        .from('academic_years')
        .insert({
          school_id: school.id,
          name: '2026-27',
          start_date: '2026-04-01',
          end_date: '2027-03-31',
          is_current: true,
        })
        .select()
        .single()

      if (yearError) throw yearError

      // 6. Create default classes
      const classInserts = DEFAULT_CLASSES.map((name) => ({
        school_id: school.id,
        academic_year_id: academicYear.id,
        name,
        capacity: name.startsWith('Class') ? 40 : 30,
      }))

      const { error: classError } = await supabase
        .from('classes')
        .insert(classInserts)

      if (classError) throw classError

      // 7. Create default communication templates
      const { error: templateError } = await supabase
        .from('comm_templates')
        .insert([
          {
            school_id: school.id,
            name: 'Fee Reminder',
            body: 'Dear {parent_name}, this is a reminder that fees of ₹{amount} for {student_name} ({class}) are due on {due_date}. Please clear the dues at the earliest. - {school_name}',
            type: 'fee_reminder',
          },
          {
            school_id: school.id,
            name: 'Absence Alert',
            body: 'Dear {parent_name}, we noticed {student_name} was absent today ({date}). We hope everything is well. Please inform us if your child will be absent for an extended period. - {school_name}',
            type: 'absence_alert',
          },
          {
            school_id: school.id,
            name: 'Holiday Notice',
            body: 'Dear Parents, please note that the school will remain closed on {date} on account of {reason}. Regular classes will resume on {resume_date}. - {school_name}',
            type: 'holiday_notice',
          },
        ])

      if (templateError) throw templateError

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">PS</span>
        </div>
        <h1 className="text-2xl font-bold text-text">Set Up Your School</h1>
        <p className="text-text-muted mt-1">Step {step} of 2</p>
      </div>

      <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSignup} className="card space-y-4">
        {error && (
          <div className="bg-red-50 text-danger text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <h2 className="font-semibold text-lg">Your Account</h2>
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Mrs. Neeta Parmar" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@school.com" required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98180 97475" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
            </div>
            <button type="submit" className="btn-primary w-full">Next: School Details</button>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-lg">School Details</h2>
            <div>
              <label className="label">School Name</label>
              <input type="text" className="input" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Kids Planet" required />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea className="input" rows={2} value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} placeholder="Dhalpur, Kullu, HP" />
            </div>
            <div>
              <label className="label">School Phone</label>
              <input type="tel" className="input" value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)} placeholder="+91 98180 97475" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Setting up...' : 'Create School'}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="text-center text-sm text-text-muted mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </p>
    </div>
  )
}
