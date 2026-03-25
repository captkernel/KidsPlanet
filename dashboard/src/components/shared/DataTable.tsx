'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  searchKeys?: string[]
  emptyMessage?: string
  onRowClick?: (row: T) => void
  loading?: boolean
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  searchKeys = [],
  emptyMessage = 'No data found',
  onRowClick,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? data.filter((row) =>
        searchKeys.some((key) =>
          String(row[key] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : data

  if (loading) {
    return (
      <div className="card">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-surface-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {searchable && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">
          {emptyMessage}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card overflow-x-auto p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-muted">
                  {columns.map((col) => (
                    <th key={col.key} className="text-left text-sm font-medium text-text-muted px-4 py-3">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-surface-muted last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-surface-muted/50' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm">
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((row, i) => (
              <div
                key={i}
                className={`card ${onRowClick ? 'cursor-pointer active:bg-surface-muted' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <div key={col.key} className="flex justify-between items-center py-1">
                    <span className="text-xs text-text-muted">{col.label}</span>
                    <span className="text-sm font-medium">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
