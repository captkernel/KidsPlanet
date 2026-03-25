'use client'

import { useAuth } from '@/lib/hooks/useAuth'

interface RoleGuardProps {
  roles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { profile } = useAuth()
  if (!profile) return null
  if (!roles.some((role) => profile.roles.includes(role))) return <>{fallback}</>
  return <>{children}</>
}
