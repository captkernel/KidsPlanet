'use client'

interface FormFieldProps {
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'password' | 'select' | 'textarea'
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
  min?: number
  disabled?: boolean
}

export function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  options,
  rows = 3,
  min,
  disabled = false,
}: FormFieldProps) {
  const baseClass = `input ${error ? 'border-danger' : ''}`

  return (
    <div>
      <label htmlFor={name} className="label mb-1.5">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
        >
          <option value="">{placeholder ?? 'Select...'}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          disabled={disabled}
        />
      )}

      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  )
}
