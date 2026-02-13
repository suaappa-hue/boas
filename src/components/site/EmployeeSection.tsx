'use client'

import { useEffect, useState } from 'react'

interface Employee {
  id: string
  이름: string
  직책: string
  소개: string
  프로필이미지: string
  이미지위치: string
  순서: number
  활성여부: boolean
  자금유형: string[]
  업무영역: string[]
  산업분야: string[]
}

function parseImagePosition(pos: string): { objectPosition: string; scale: number } {
  if (!pos) return { objectPosition: '50% 20%', scale: 1 }
  const parts = pos.trim().split(/\s+/)
  const x = parts[0] || '50%'
  const y = parts[1] || '20%'
  const zoom = parts[2] ? Number(parts[2]) / 100 : 1
  return { objectPosition: `${x} ${y}`, scale: zoom }
}

export default function EmployeeSection() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEmployees(data.employees)
      })
      .catch(console.error)
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded) return null
  if (employees.length === 0) return null

  const isMulti = employees.length >= 2

  return (
    <>
      <div className="boas-expert-header">
        <h3 className="boas-expert-title">전문 경영컨설턴트</h3>
        <p className="boas-expert-subtitle">
          기업의 잠재력을 읽는 전문가가<br className="mobile-br" />자금의 길을 열어드립니다
        </p>
      </div>

      {isMulti ? (
        <div className="boas-expert-grid boas-expert-grid--multi">
          {employees.map((emp) => {
            const { objectPosition, scale } = parseImagePosition(emp.이미지위치)
            const badges = [...(emp.자금유형 || []), ...(emp.업무영역 || []), ...(emp.산업분야 || [])]
            return (
              <div key={emp.id} className="boas-expert-card boas-expert-card--compact">
                <div className="boas-expert-photo">
                  {emp.프로필이미지 ? (
                    <img
                      src={emp.프로필이미지}
                      alt={`${emp.이름} ${emp.직책}`}
                      style={{ objectPosition, transform: `scale(${scale})` }}
                    />
                  ) : (
                    <div className="boas-expert-photo-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48, color: '#94A3B8' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="boas-expert-compact-info">
                  <h4 className="boas-expert-name">{emp.이름}</h4>
                  <p className="boas-expert-role">{emp.직책}</p>
                  {emp.소개 && <p className="boas-expert-intro">{emp.소개}</p>}
                  {badges.length > 0 && (
                    <div className="boas-expert-badges">
                      {badges.map((b) => (
                        <span key={b} className="boas-expert-badge">{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="boas-expert-grid">
          {employees.map((emp) => {
            const { objectPosition, scale } = parseImagePosition(emp.이미지위치)
            const badges = [...(emp.자금유형 || []), ...(emp.업무영역 || []), ...(emp.산업분야 || [])]
            return (
              <div key={emp.id} className="boas-expert-card">
                <div className="boas-expert-profile">
                  <div className="boas-expert-photo">
                    {emp.프로필이미지 ? (
                      <img
                        src={emp.프로필이미지}
                        alt={`${emp.이름} ${emp.직책}`}
                        style={{ objectPosition, transform: `scale(${scale})` }}
                      />
                    ) : (
                      <div className="boas-expert-photo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48, color: '#94A3B8' }}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="boas-expert-name">{emp.이름}</h4>
                  <p className="boas-expert-role">{emp.직책}</p>
                </div>
                <div className="boas-expert-message">
                  {emp.소개 && (
                    <p className="boas-expert-greeting">
                      안녕하세요, {emp.직책} {emp.이름}입니다.
                    </p>
                  )}
                  {emp.소개 && (
                    <p className="boas-expert-description">{emp.소개}</p>
                  )}
                  {badges.length > 0 && (
                    <div className="boas-expert-badges" style={{ marginTop: 16 }}>
                      {badges.map((b) => (
                        <span key={b} className="boas-expert-badge">{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
