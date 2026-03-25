'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile, School } from '@/lib/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  school: School | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  school: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)

          const { data: schoolData } = await supabase
            .from('schools')
            .select('*')
            .eq('id', profileData.school_id)
            .single()

          setSchool(schoolData)
        }
      }

      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) {
          setProfile(null)
          setSchool(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSchool(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, school, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
