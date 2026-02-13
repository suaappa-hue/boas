'use client'

import type { VariableField } from '@/lib/email/types'

interface Props {
  fields: VariableField[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

const INPUT_CLASS = 'w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-[#009CA0] focus:ring-2 focus:ring-[#009CA0]/10 transition-all'

export default function EmailVariableForm({ fields, values, onChange }: Props) {
  // halfWidth 필드끼리 2열 그리드로 묶기
  const rows: VariableField[][] = []
  let i = 0
  while (i < fields.length) {
    if (fields[i].halfWidth && i + 1 < fields.length && fields[i + 1].halfWidth) {
      rows.push([fields[i], fields[i + 1]])
      i += 2
    } else {
      rows.push([fields[i]])
      i++
    }
  }

  return (
    <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-5 space-y-4">
      {rows.map((row, ri) =>
        row.length === 2 ? (
          <div key={ri} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{field.label} *</label>
                <input
                  type={field.type === 'date' ? 'date' : 'text'}
                  value={values[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={INPUT_CLASS}
                />
              </div>
            ))}
          </div>
        ) : (
          <div key={ri}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{row[0].label} *</label>
            {row[0].type === 'textarea' ? (
              <textarea
                rows={3}
                value={values[row[0].key] || ''}
                onChange={(e) => onChange(row[0].key, e.target.value)}
                placeholder={row[0].placeholder}
                className={INPUT_CLASS + ' resize-none'}
              />
            ) : (
              <input
                type={row[0].type === 'date' ? 'date' : 'text'}
                value={values[row[0].key] || ''}
                onChange={(e) => onChange(row[0].key, e.target.value)}
                placeholder={row[0].placeholder}
                className={INPUT_CLASS}
              />
            )}
          </div>
        )
      )}
    </div>
  )
}
