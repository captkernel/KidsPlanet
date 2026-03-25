'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import type { ActivityLibraryItem } from '@/lib/types/database'
import { ArrowLeft, Plus, Search, Trash2, BookOpen } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  circle_time: 'bg-blue-100 text-blue-700',
  free_play: 'bg-green-100 text-green-700',
  art: 'bg-purple-100 text-purple-700',
  music: 'bg-pink-100 text-pink-700',
  outdoor: 'bg-emerald-100 text-emerald-700',
  story: 'bg-amber-100 text-amber-700',
  sensory: 'bg-cyan-100 text-cyan-700',
}

const TYPE_OPTIONS = [
  { value: 'circle_time', label: 'Circle Time' },
  { value: 'free_play', label: 'Free Play' },
  { value: 'art', label: 'Art & Craft' },
  { value: 'music', label: 'Music' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'story', label: 'Story' },
  { value: 'sensory', label: 'Sensory' },
]

// Pre-loaded default activities for preschool
const DEFAULT_ACTIVITIES = [
  { name: 'Morning Circle Time', type: 'circle_time', description: 'Greetings, calendar, weather, theme discussion', age_group: 'All', duration_mins: 20 },
  { name: 'Show and Tell', type: 'circle_time', description: 'Children share items or stories', age_group: 'All', duration_mins: 15 },
  { name: 'Alphabet Song', type: 'music', description: 'Sing-along with alphabet chart', age_group: 'Nursery+', duration_mins: 10 },
  { name: 'Number Recognition', type: 'circle_time', description: 'Counting activities with objects', age_group: 'All', duration_mins: 15 },
  { name: 'Color Sorting', type: 'sensory', description: 'Sort objects by color', materials: 'Colored blocks, bowls', age_group: 'Playgroup+', duration_mins: 15 },
  { name: 'Finger Painting', type: 'art', description: 'Free painting with finger paints', materials: 'Finger paints, paper, aprons', age_group: 'All', duration_mins: 20 },
  { name: 'Paper Cutting & Pasting', type: 'art', description: 'Cut shapes and create collage', materials: 'Safety scissors, glue, colored paper', age_group: 'KG+', duration_mins: 25 },
  { name: 'Clay Modelling', type: 'art', description: 'Make shapes with play dough', materials: 'Play dough, molds, rolling pins', age_group: 'All', duration_mins: 20 },
  { name: 'Drawing & Coloring', type: 'art', description: 'Free drawing or guided coloring', materials: 'Crayons, coloring sheets', age_group: 'All', duration_mins: 20 },
  { name: 'Music and Movement', type: 'music', description: 'Dance and movement to songs', age_group: 'All', duration_mins: 15 },
  { name: 'Nursery Rhymes', type: 'music', description: 'Singing familiar rhymes with actions', age_group: 'Playgroup+', duration_mins: 15 },
  { name: 'Rhythm & Instruments', type: 'music', description: 'Play drums, tambourine, bells', materials: 'Musical instruments', age_group: 'All', duration_mins: 15 },
  { name: 'Outdoor Free Play', type: 'outdoor', description: 'Playground time — slides, swings, sandbox', age_group: 'All', duration_mins: 30 },
  { name: 'Ball Games', type: 'outdoor', description: 'Throwing, catching, kicking', materials: 'Soft balls', age_group: 'All', duration_mins: 20 },
  { name: 'Obstacle Course', type: 'outdoor', description: 'Simple obstacle course for motor skills', materials: 'Cones, hoops, tunnels', age_group: 'KG+', duration_mins: 25 },
  { name: 'Nature Walk', type: 'outdoor', description: 'Explore school garden, collect leaves', age_group: 'All', duration_mins: 20 },
  { name: 'Running & Races', type: 'outdoor', description: 'Short sprints and relay races', age_group: 'KG+', duration_mins: 15 },
  { name: 'Story Read-Aloud', type: 'story', description: 'Teacher reads a picture book', materials: 'Picture books', age_group: 'All', duration_mins: 15 },
  { name: 'Puppet Show', type: 'story', description: 'Story narration with hand puppets', materials: 'Hand puppets', age_group: 'All', duration_mins: 15 },
  { name: 'Story Sequencing', type: 'story', description: 'Order picture cards to retell a story', materials: 'Sequencing cards', age_group: 'KG+', duration_mins: 15 },
  { name: 'Picture Description', type: 'story', description: 'Describe what they see in a picture', materials: 'Picture cards', age_group: 'Nursery+', duration_mins: 10 },
  { name: 'Sand Play', type: 'sensory', description: 'Digging, pouring, making shapes in sand', materials: 'Sand tray, molds, spoons', age_group: 'All', duration_mins: 20 },
  { name: 'Water Play', type: 'sensory', description: 'Pouring, measuring, floating/sinking', materials: 'Water tray, cups, sponges', age_group: 'All', duration_mins: 20 },
  { name: 'Texture Exploration', type: 'sensory', description: 'Feel and describe different textures', materials: 'Fabric swatches, sandpaper, cotton', age_group: 'All', duration_mins: 15 },
  { name: 'Playdough Shapes', type: 'sensory', description: 'Roll, flatten, cut shapes from dough', materials: 'Play dough, cutters', age_group: 'All', duration_mins: 20 },
  { name: 'Rice/Grain Sensory Bin', type: 'sensory', description: 'Scoop and pour grains, find hidden items', materials: 'Rice, containers, small toys', age_group: 'Playgroup+', duration_mins: 15 },
  { name: 'Block Building', type: 'free_play', description: 'Build structures with blocks', materials: 'Building blocks', age_group: 'All', duration_mins: 20 },
  { name: 'Dress-Up Corner', type: 'free_play', description: 'Imaginative play with costumes', materials: 'Costumes, hats, accessories', age_group: 'All', duration_mins: 20 },
  { name: 'Kitchen Play', type: 'free_play', description: 'Pretend cooking and serving', materials: 'Toy kitchen set', age_group: 'All', duration_mins: 20 },
  { name: 'Puzzle Time', type: 'free_play', description: 'Age-appropriate jigsaw puzzles', materials: 'Puzzles', age_group: 'All', duration_mins: 15 },
  { name: 'Bead Threading', type: 'free_play', description: 'Thread beads on a string for fine motor skills', materials: 'Beads, strings', age_group: 'Nursery+', duration_mins: 15 },
  { name: 'Pattern Making', type: 'circle_time', description: 'Create patterns with colored objects', materials: 'Colored blocks, beads', age_group: 'KG+', duration_mins: 15 },
  { name: 'Tracing & Writing', type: 'circle_time', description: 'Trace letters, numbers, or shapes', materials: 'Worksheets, pencils', age_group: 'KG+', duration_mins: 15 },
  { name: 'Phonics Practice', type: 'circle_time', description: 'Sound recognition and blending', materials: 'Flash cards', age_group: 'KG+', duration_mins: 15 },
  { name: 'Hindi Akshar', type: 'circle_time', description: 'Hindi letter recognition and writing', materials: 'Hindi chart, worksheets', age_group: 'KG+', duration_mins: 15 },
  { name: 'Yoga for Kids', type: 'outdoor', description: 'Simple yoga poses — tree, butterfly, cat', age_group: 'All', duration_mins: 15 },
  { name: 'Simon Says', type: 'outdoor', description: 'Follow the leader with actions', age_group: 'All', duration_mins: 10 },
  { name: 'Gardening', type: 'outdoor', description: 'Water plants, dig soil, plant seeds', materials: 'Watering cans, small shovels', age_group: 'All', duration_mins: 20 },
  { name: 'Origami', type: 'art', description: 'Simple paper folding — boat, plane, hat', materials: 'Colored paper', age_group: 'KG+', duration_mins: 20 },
  { name: 'Stamp Printing', type: 'art', description: 'Print patterns with stamps or vegetables', materials: 'Stamps, paint, paper', age_group: 'All', duration_mins: 20 },
  { name: 'Hand Print Art', type: 'art', description: 'Create animals and shapes from handprints', materials: 'Paint, paper', age_group: 'All', duration_mins: 15 },
  { name: 'Science Experiment', type: 'sensory', description: 'Simple experiments — mixing colors, magnets', materials: 'Varies by experiment', age_group: 'KG+', duration_mins: 20 },
  { name: 'Sorting & Classifying', type: 'circle_time', description: 'Sort objects by size, shape, or color', materials: 'Assorted objects', age_group: 'All', duration_mins: 15 },
  { name: 'Memory Game', type: 'free_play', description: 'Match pairs of cards', materials: 'Memory cards', age_group: 'Nursery+', duration_mins: 15 },
  { name: 'Role Play', type: 'free_play', description: 'Act out scenarios — doctor, shopkeeper', materials: 'Props, costumes', age_group: 'All', duration_mins: 20 },
  { name: 'Lacing Cards', type: 'free_play', description: 'Thread laces through holes for fine motor', materials: 'Lacing cards', age_group: 'Playgroup+', duration_mins: 10 },
  { name: 'Stacking & Nesting', type: 'free_play', description: 'Stack cups, nest boxes by size', materials: 'Stacking cups, nesting boxes', age_group: 'Playgroup', duration_mins: 10 },
  { name: 'Animal Sounds', type: 'circle_time', description: 'Identify and mimic animal sounds', materials: 'Animal flashcards', age_group: 'Playgroup+', duration_mins: 10 },
  { name: 'Goodbye Circle', type: 'circle_time', description: 'Recap the day, goodbye song', age_group: 'All', duration_mins: 10 },
  { name: 'Dance Party', type: 'music', description: 'Free dance to fun music', age_group: 'All', duration_mins: 15 },
]

export default function ActivityLibraryPage() {
  const { school, profile } = useAuth()
  const [items, setItems] = useState<ActivityLibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', description: '', materials: '', age_group: '', duration_mins: '' })
  const [seeding, setSeeding] = useState(false)

  const isAdmin = profile?.primary_role === 'admin'

  const fetchItems = async () => {
    if (!school?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('activity_library')
      .select('*')
      .eq('school_id', school.id)
      .order('name')
    if (data) setItems(data as ActivityLibraryItem[])
  }

  useEffect(() => {
    if (!school?.id) return
    setLoading(true)
    fetchItems().finally(() => setLoading(false))
  }, [school?.id])

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || i.type === typeFilter
      return matchSearch && matchType
    })
  }, [items, search, typeFilter])

  const handleAdd = async () => {
    if (!school?.id || !form.name) return
    const supabase = createClient()
    await supabase.from('activity_library').insert({
      school_id: school.id,
      name: form.name,
      type: form.type || null,
      description: form.description || null,
      materials: form.materials || null,
      age_group: form.age_group || null,
      duration_mins: form.duration_mins ? parseInt(form.duration_mins) : null,
    })
    setShowAdd(false)
    setForm({ name: '', type: '', description: '', materials: '', age_group: '', duration_mins: '' })
    await fetchItems()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from('activity_library').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const handleSeedDefaults = async () => {
    if (!school?.id) return
    setSeeding(true)
    const supabase = createClient()
    const inserts = DEFAULT_ACTIVITIES.map((a) => ({
      school_id: school.id,
      name: a.name,
      type: a.type,
      description: a.description,
      materials: (a as { materials?: string }).materials || null,
      age_group: a.age_group,
      duration_mins: a.duration_mins,
      is_default: true,
    }))
    await supabase.from('activity_library').insert(inserts)
    await fetchItems()
    setSeeding(false)
  }

  return (
    <>
      <Link href="/curriculum" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4">
        <ArrowLeft size={16} /> Back to Curriculum
      </Link>

      <PageHeader
        title="Activity Library"
        subtitle={`${items.length} activities`}
        actions={
          isAdmin ? (
            <div className="flex gap-2">
              {items.length === 0 && (
                <button onClick={handleSeedDefaults} className="btn-secondary flex items-center gap-2" disabled={seeding}>
                  <BookOpen size={16} /> {seeding ? 'Loading...' : 'Load 50+ Defaults'}
                </button>
              )}
              <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Add Activity
              </button>
            </div>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input w-auto">
          <option value="all">All Types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-28" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted mb-4">No activities in the library yet.</p>
          {isAdmin && items.length === 0 && (
            <button onClick={handleSeedDefaults} className="btn-primary" disabled={seeding}>
              {seeding ? 'Loading...' : 'Load 50+ Default Activities'}
            </button>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card !p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm text-primary-dark">{item.name}</div>
                  <div className="flex gap-2 mt-1">
                    {item.type && (
                      <span className={`badge text-[10px] ${TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-700'}`}>
                        {TYPE_OPTIONS.find((t) => t.value === item.type)?.label || item.type}
                      </span>
                    )}
                    {item.age_group && (
                      <span className="badge text-[10px] bg-surface-cream text-text-muted">{item.age_group}</span>
                    )}
                    {item.duration_mins && (
                      <span className="text-[10px] text-text-muted">{item.duration_mins} min</span>
                    )}
                  </div>
                  {item.description && <div className="text-xs text-text-light mt-2">{item.description}</div>}
                  {item.materials && <div className="text-xs text-text-muted mt-1">Materials: {item.materials}</div>}
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(item.id)} className="text-text-muted hover:text-danger p-1">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Activity Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Activity to Library">
        <div className="space-y-4">
          <FormField label="Name" name="lib_name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} required />
          <FormField label="Type" name="lib_type" type="select" value={form.type} onChange={(v) => setForm((p) => ({ ...p, type: v }))} options={TYPE_OPTIONS} />
          <FormField label="Description" name="lib_desc" type="textarea" value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} rows={2} />
          <FormField label="Materials" name="lib_materials" value={form.materials} onChange={(v) => setForm((p) => ({ ...p, materials: v }))} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Age Group" name="lib_age" value={form.age_group} onChange={(v) => setForm((p) => ({ ...p, age_group: v }))} placeholder="e.g. All, KG+" />
            <FormField label="Duration (mins)" name="lib_duration" type="number" value={form.duration_mins} onChange={(v) => setForm((p) => ({ ...p, duration_mins: v }))} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary flex-1" disabled={!form.name}>Add</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
