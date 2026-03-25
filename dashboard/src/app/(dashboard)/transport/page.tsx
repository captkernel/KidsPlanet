'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import type { Route, RouteStop, StudentTransport, StaffProfile, Student } from '@/lib/types/database'
import { Bus, Plus, MapPin, Users, Printer, Trash2, UserPlus } from 'lucide-react'

interface RouteWithDetails extends Route {
  stops: RouteStop[]
  driver: StaffProfile | null
  student_transport: (StudentTransport & { student: Student })[]
}

export default function TransportPage() {
  const { school, profile } = useAuth()
  const [routes, setRoutes] = useState<RouteWithDetails[]>([])
  const [drivers, setDrivers] = useState<StaffProfile[]>([])
  const [students, setStudents] = useState<{ id: string; full_name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [showAddRoute, setShowAddRoute] = useState(false)
  const [showAddStop, setShowAddStop] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [routeForm, setRouteForm] = useState({ name: '', driver_id: '', vehicle_number: '', capacity: '' })
  const [stopForm, setStopForm] = useState({ stop_name: '', pickup_time: '', sequence_order: '' })
  const [assignForm, setAssignForm] = useState({ student_id: '', stop_id: '', type: 'both' })

  const isAdmin = profile?.primary_role === 'admin'

  const fetchData = async () => {
    if (!school?.id) return
    const supabase = createClient()
    const [routesRes, driversRes, studentsRes] = await Promise.all([
      supabase
        .from('routes')
        .select('*, driver:staff_profiles(id, full_name), stops:route_stops(*, student_transport:student_transport(*, student:students(id, full_name)))')
        .eq('school_id', school.id)
        .order('name'),
      supabase
        .from('staff_profiles')
        .select('id, full_name')
        .eq('school_id', school.id)
        .eq('status', 'active')
        .in('designation', ['driver', 'other']),
      supabase
        .from('students')
        .select('id, full_name')
        .eq('school_id', school.id)
        .eq('status', 'active')
        .order('full_name'),
    ])

    if (routesRes.data) {
      // Restructure: collect student_transport from stops into the route level
      const routesWithDetails = routesRes.data.map((r: Record<string, unknown>) => {
        const stops = ((r.stops as RouteStop[]) || []).sort(
          (a: RouteStop, b: RouteStop) => (a.sequence_order || 0) - (b.sequence_order || 0)
        )
        const allStudentTransport: (StudentTransport & { student: Student })[] = []
        for (const stop of stops) {
          const st = (stop as unknown as Record<string, unknown>).student_transport as (StudentTransport & { student: Student })[] || []
          allStudentTransport.push(...st)
        }
        return { ...r, stops, student_transport: allStudentTransport } as RouteWithDetails
      })
      setRoutes(routesWithDetails)
    }
    if (driversRes.data) setDrivers(driversRes.data as StaffProfile[])
    if (studentsRes.data) setStudents(studentsRes.data)
  }

  useEffect(() => {
    if (!school?.id) return
    setLoading(true)
    fetchData().finally(() => setLoading(false))
  }, [school?.id])

  const active = routes.find((r) => r.id === selectedRoute)

  const handleAddRoute = async () => {
    if (!school?.id || !routeForm.name) return
    const supabase = createClient()
    await supabase.from('routes').insert({
      school_id: school.id,
      name: routeForm.name,
      driver_id: routeForm.driver_id || null,
      vehicle_number: routeForm.vehicle_number || null,
      capacity: routeForm.capacity ? parseInt(routeForm.capacity) : null,
    })
    setShowAddRoute(false)
    setRouteForm({ name: '', driver_id: '', vehicle_number: '', capacity: '' })
    await fetchData()
  }

  const handleAddStop = async () => {
    if (!school?.id || !selectedRoute || !stopForm.stop_name) return
    const supabase = createClient()
    await supabase.from('route_stops').insert({
      route_id: selectedRoute,
      school_id: school.id,
      stop_name: stopForm.stop_name,
      pickup_time: stopForm.pickup_time || null,
      sequence_order: stopForm.sequence_order ? parseInt(stopForm.sequence_order) : null,
    })
    setShowAddStop(false)
    setStopForm({ stop_name: '', pickup_time: '', sequence_order: '' })
    await fetchData()
  }

  const handleAssignStudent = async () => {
    if (!school?.id || !selectedRoute || !assignForm.student_id) return
    const supabase = createClient()
    await supabase.from('student_transport').insert({
      student_id: assignForm.student_id,
      school_id: school.id,
      route_id: selectedRoute,
      stop_id: assignForm.stop_id || null,
      type: assignForm.type,
    })
    setShowAssign(false)
    setAssignForm({ student_id: '', stop_id: '', type: 'both' })
    await fetchData()
  }

  const handlePrintDriverSheet = () => {
    window.print()
  }

  return (
    <>
      <PageHeader
        title="Transport"
        subtitle={`${routes.length} routes`}
        actions={
          isAdmin ? (
            <button onClick={() => setShowAddRoute(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Route
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route list */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-24" />
            ))
          ) : routes.length === 0 ? (
            <div className="card text-center py-12">
              <Bus size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">No routes configured yet.</p>
            </div>
          ) : (
            routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`card !p-4 w-full text-left transition-shadow ${
                  selectedRoute === route.id ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-primary-dark">{route.name}</div>
                    <div className="text-xs text-text-muted">
                      {route.driver?.full_name || 'No driver'} {route.vehicle_number && `— ${route.vehicle_number}`}
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <MapPin size={10} /> {route.stops?.length || 0} stops
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Users size={10} /> {route.student_transport?.length || 0} students
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={route.status} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Route details */}
        <div className="lg:col-span-2">
          {!selectedRoute ? (
            <div className="card text-center py-16">
              <Bus size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-muted">Select a route to see details.</p>
            </div>
          ) : active ? (
            <div className="space-y-4">
              {/* Route info card */}
              <div className="card print-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-primary-dark">{active.name}</h2>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <>
                        <button onClick={() => setShowAddStop(true)} className="btn-secondary text-xs flex items-center gap-1">
                          <MapPin size={12} /> Add Stop
                        </button>
                        <button onClick={() => setShowAssign(true)} className="btn-secondary text-xs flex items-center gap-1">
                          <UserPlus size={12} /> Assign Student
                        </button>
                      </>
                    )}
                    <button onClick={handlePrintDriverSheet} className="btn-secondary text-xs flex items-center gap-1">
                      <Printer size={12} /> Print
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                  <div><span className="text-xs text-text-muted block">Driver</span>{active.driver?.full_name || '—'}</div>
                  <div><span className="text-xs text-text-muted block">Vehicle</span>{active.vehicle_number || '—'}</div>
                  <div><span className="text-xs text-text-muted block">Capacity</span>{active.capacity || '—'}</div>
                  <div><span className="text-xs text-text-muted block">Students</span>{active.student_transport?.length || 0}</div>
                </div>

                {/* Stops */}
                <h3 className="font-bold text-sm text-primary-dark mb-2">Stops</h3>
                {(active.stops?.length || 0) === 0 ? (
                  <p className="text-xs text-text-muted">No stops added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {active.stops.map((stop, idx) => (
                      <div key={stop.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface-cream">
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {stop.sequence_order || idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{stop.stop_name}</div>
                        </div>
                        {stop.pickup_time && (
                          <span className="text-xs text-text-muted">{stop.pickup_time}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Students */}
                <h3 className="font-bold text-sm text-primary-dark mt-4 mb-2">Students</h3>
                {(active.student_transport?.length || 0) === 0 ? (
                  <p className="text-xs text-text-muted">No students assigned yet.</p>
                ) : (
                  <div className="space-y-2">
                    {active.student_transport.map((st) => (
                      <div key={st.id} className="flex items-center justify-between py-2 border-b border-surface-muted last:border-0">
                        <span className="text-sm font-medium">{st.student?.full_name}</span>
                        <span className="badge text-xs bg-surface-cream text-text-muted capitalize">{st.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Add Route Modal */}
      <Modal open={showAddRoute} onClose={() => setShowAddRoute(false)} title="Add Route">
        <div className="space-y-4">
          <FormField label="Route Name" name="route_name" value={routeForm.name} onChange={(v) => setRouteForm((p) => ({ ...p, name: v }))} required placeholder="e.g. Route 1 - Dhalpur" />
          <FormField label="Driver" name="route_driver" type="select" value={routeForm.driver_id} onChange={(v) => setRouteForm((p) => ({ ...p, driver_id: v }))} options={drivers.map((d) => ({ value: d.id, label: d.full_name }))} />
          <FormField label="Vehicle Number" name="vehicle_no" value={routeForm.vehicle_number} onChange={(v) => setRouteForm((p) => ({ ...p, vehicle_number: v }))} placeholder="e.g. HP 01 AB 1234" />
          <FormField label="Capacity" name="capacity" type="number" value={routeForm.capacity} onChange={(v) => setRouteForm((p) => ({ ...p, capacity: v }))} />
          <div className="flex gap-3">
            <button onClick={handleAddRoute} className="btn-primary flex-1" disabled={!routeForm.name}>Add Route</button>
            <button onClick={() => setShowAddRoute(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Add Stop Modal */}
      <Modal open={showAddStop} onClose={() => setShowAddStop(false)} title="Add Stop">
        <div className="space-y-4">
          <FormField label="Stop Name" name="stop_name" value={stopForm.stop_name} onChange={(v) => setStopForm((p) => ({ ...p, stop_name: v }))} required placeholder="e.g. Dhalpur Bus Stand" />
          <FormField label="Pickup Time" name="pickup_time" value={stopForm.pickup_time} onChange={(v) => setStopForm((p) => ({ ...p, pickup_time: v }))} placeholder="e.g. 8:00 AM" />
          <FormField label="Order" name="seq_order" type="number" value={stopForm.sequence_order} onChange={(v) => setStopForm((p) => ({ ...p, sequence_order: v }))} placeholder="1, 2, 3..." />
          <div className="flex gap-3">
            <button onClick={handleAddStop} className="btn-primary flex-1" disabled={!stopForm.stop_name}>Add Stop</button>
            <button onClick={() => setShowAddStop(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Assign Student Modal */}
      <Modal open={showAssign} onClose={() => setShowAssign(false)} title="Assign Student to Route">
        <div className="space-y-4">
          <FormField label="Student" name="assign_student" type="select" value={assignForm.student_id} onChange={(v) => setAssignForm((p) => ({ ...p, student_id: v }))} options={students.map((s) => ({ value: s.id, label: s.full_name }))} required />
          {active?.stops && active.stops.length > 0 && (
            <FormField label="Stop" name="assign_stop" type="select" value={assignForm.stop_id} onChange={(v) => setAssignForm((p) => ({ ...p, stop_id: v }))} options={active.stops.map((s) => ({ value: s.id, label: s.stop_name }))} />
          )}
          <FormField label="Type" name="assign_type" type="select" value={assignForm.type} onChange={(v) => setAssignForm((p) => ({ ...p, type: v }))} options={[
            { value: 'both', label: 'Pickup & Drop' },
            { value: 'pickup', label: 'Pickup Only' },
            { value: 'drop', label: 'Drop Only' },
          ]} />
          <div className="flex gap-3">
            <button onClick={handleAssignStudent} className="btn-primary flex-1" disabled={!assignForm.student_id}>Assign</button>
            <button onClick={() => setShowAssign(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
