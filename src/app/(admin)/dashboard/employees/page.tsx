'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

/* ────────────── 타입 & 상수 ────────────── */
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

interface EmployeeForm {
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

const emptyForm: EmployeeForm = {
  이름: '',
  직책: '',
  소개: '',
  프로필이미지: '',
  이미지위치: '50% 20% 100',
  순서: 1,
  활성여부: true,
  자금유형: [],
  업무영역: [],
  산업분야: [],
}

const BADGE_CATEGORIES = {
  자금유형: ['정책자금', '창업자금', 'R&D자금', '시설자금', '운전자금'],
  업무영역: ['사업계획서', '현황분석', '인증컨설팅', '세무회계', '법률자문'],
  산업분야: ['제조업', 'IT/SW', '바이오', '친환경', '서비스업'],
} as const

const MAX_BADGES = 4

/* ────────────── WebP 압축 유틸 ────────────── */
function compressToWebP(file: File, maxSize = 100 * 1024, maxDim = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height

        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }

        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas not supported'))
        ctx.drawImage(img, 0, 0, w, h)

        let quality = 0.8
        let dataUrl = canvas.toDataURL('image/webp', quality)

        while (dataUrl.length * 0.75 > maxSize && quality > 0.1) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/webp', quality)
        }

        if (dataUrl.length * 0.75 > maxSize && (w > 600 || h > 600)) {
          const ratio2 = Math.min(600 / w, 600 / h)
          w = Math.round(w * ratio2)
          h = Math.round(h * ratio2)
          canvas.width = w
          canvas.height = h
          const ctx2 = canvas.getContext('2d')
          if (ctx2) {
            ctx2.drawImage(img, 0, 0, w, h)
            quality = 0.8
            dataUrl = canvas.toDataURL('image/webp', quality)
            while (dataUrl.length * 0.75 > maxSize && quality > 0.1) {
              quality -= 0.1
              dataUrl = canvas.toDataURL('image/webp', quality)
            }
          }
        }

        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('이미지 로드 실패'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsDataURL(file)
  })
}

/* ────────────── R2 이미지 삭제 유틸 (클라이언트) ────────────── */
async function deleteR2ImageClient(url: string): Promise<void> {
  if (!url) return
  try {
    await fetch(`/api/upload-thumbnail?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    })
  } catch (e) {
    console.error('[BOAS] Failed to delete R2 image:', e)
  }
}

/* ────────────── 이미지 위치 파서 ────────────── */
function parseImagePosition(pos: string): { x: number; y: number; zoom: number } {
  const parts = pos.trim().split(/\s+/)
  return {
    x: parseInt(parts[0]) || 50,
    y: parseInt(parts[1]) || 20,
    zoom: parseInt(parts[2]) || 100,
  }
}

function formatImagePosition(x: number, y: number, zoom: number): string {
  return `${x}% ${y}% ${zoom}`
}

/* ────────────── 메인 페이지 ────────────── */
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [form, setForm] = useState<EmployeeForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── 데이터 로드 ── */
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch('/api/employees?all=true')
      const data = await res.json()
      if (data.success) {
        setEmployees(data.employees)
      }
    } catch (error) {
      console.error('Employees fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  /* ── 폼 헬퍼 ── */
  const setField = useCallback(<K extends keyof EmployeeForm>(key: K, value: EmployeeForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  /* ── 뱃지 선택 (전체 4개 제한) ── */
  const totalBadges = form.자금유형.length + form.업무영역.length + form.산업분야.length

  const toggleBadge = (category: '자금유형' | '업무영역' | '산업분야', value: string) => {
    setForm((prev) => {
      const current = prev[category]
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((v) => v !== value) }
      }
      const total = prev.자금유형.length + prev.업무영역.length + prev.산업분야.length
      if (total >= MAX_BADGES) return prev
      return { ...prev, [category]: [...current, value] }
    })
  }

  /* ── 이미지 위치 값 ── */
  const imgPos = parseImagePosition(form.이미지위치)

  /* ── 모달 열기 ── */
  const openCreateModal = () => {
    setEditingEmployee(null)
    setForm({ ...emptyForm, 순서: employees.length + 1 })
    setShowModal(true)
    setMessage(null)
  }

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp)
    setForm({
      이름: emp.이름,
      직책: emp.직책,
      소개: emp.소개,
      프로필이미지: emp.프로필이미지,
      이미지위치: emp.이미지위치 || '50% 20% 100',
      순서: emp.순서 || 1,
      활성여부: emp.활성여부,
      자금유형: emp.자금유형 || [],
      업무영역: emp.업무영역 || [],
      산업분야: emp.산업분야 || [],
    })
    setShowModal(true)
    setMessage(null)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEmployee(null)
    setForm(emptyForm)
    setMessage(null)
  }

  /* ── 이미지 업로드 ── */
  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' })
      return
    }
    setUploading(true)
    setMessage(null)
    try {
      const oldUrl = form.프로필이미지
      const base64 = await compressToWebP(file)
      const res = await fetch('/api/upload-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, filename: file.name }),
      })
      const data = await res.json()
      if (data.success && data.url) {
        setField('프로필이미지', data.url)
        if (oldUrl) {
          deleteR2ImageClient(oldUrl)
        }
      } else {
        setMessage({ type: 'error', text: data.error || '업로드 실패' })
      }
    } catch {
      setMessage({ type: 'error', text: '이미지 업로드 중 오류가 발생했습니다.' })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    const oldUrl = form.프로필이미지
    setField('프로필이미지', '')
    if (oldUrl) {
      deleteR2ImageClient(oldUrl)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }

  /* ── 저장 ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.이름.trim()) {
      setMessage({ type: 'error', text: '이름을 입력해주세요.' })
      return
    }
    if (!form.직책.trim()) {
      setMessage({ type: 'error', text: '직책을 입력해주세요.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const isEditing = !!editingEmployee
      const method = isEditing ? 'PUT' : 'POST'
      const payload = isEditing ? { id: editingEmployee!.id, ...form } : form

      const res = await fetch('/api/employees', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        closeModal()
        await fetchEmployees()
      } else {
        setMessage({ type: 'error', text: data.error || '저장 실패' })
      }
    } catch {
      setMessage({ type: 'error', text: '서버 연결에 실패했습니다.' })
    } finally {
      setSaving(false)
    }
  }

  /* ── 삭제 ── */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/employees?id=${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id))
        setDeleteTarget(null)
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">임직원 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            홈페이지에 표시되는 전문 컨설턴트 정보를 관리합니다.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#0f172e] text-white text-sm font-medium hover:bg-[#1a2540] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          임직원 추가
        </button>
      </div>

      {/* 로딩 */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">등록된 임직원이 없습니다.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
          >
            첫 임직원 추가하기
          </button>
        </div>
      ) : (
        <>
          {/* 데스크톱 테이블 */}
          <div className="hidden md:block bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 w-16">순서</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">프로필</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">소개 / 전문분야</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 w-20">상태</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 w-32">관리</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const badges = [...(emp.자금유형 || []), ...(emp.업무영역 || []), ...(emp.산업분야 || [])]
                  return (
                    <tr key={emp.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="w-7 h-7 bg-[#0f172e] text-white text-xs font-bold rounded-lg flex items-center justify-center">
                          {emp.순서}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                            {emp.프로필이미지 ? (
                              <img src={emp.프로필이미지} alt={emp.이름} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{emp.이름}</p>
                            <p className="text-xs text-gray-400">{emp.직책}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-400 line-clamp-1 mb-1">{emp.소개 || '-'}</p>
                        {badges.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {badges.map((b) => (
                              <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400">{b}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${emp.활성여부 ? 'bg-green-100 text-green-700' : 'bg-white/[0.06] text-gray-500'}`}>
                          {emp.활성여부 ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(emp)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => setDeleteTarget(emp)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 */}
          <div className="md:hidden space-y-3">
            {employees.map((emp) => {
              const badges = [...(emp.자금유형 || []), ...(emp.업무영역 || []), ...(emp.산업분야 || [])]
              return (
                <div key={emp.id} className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                      {emp.프로필이미지 ? (
                        <img src={emp.프로필이미지} alt={emp.이름} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{emp.이름}</p>
                          <p className="text-xs text-gray-400">{emp.직책}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-[#0f172e] text-white text-[10px] font-bold rounded flex items-center justify-center">{emp.순서}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${emp.활성여부 ? 'bg-green-100 text-green-700' : 'bg-white/[0.06] text-gray-500'}`}>
                            {emp.활성여부 ? '활성' : '비활성'}
                          </span>
                        </div>
                      </div>
                      {badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {badges.map((b) => (
                            <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400">{b}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEditModal(emp)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setDeleteTarget(emp)}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ────── 추가/수정 모달 ────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141e33] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-lg font-bold text-white">
                {editingEmployee ? '임직원 수정' : '임직원 추가'}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-300 hover:bg-white/[0.08] transition-colors"
                aria-label="닫기"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 폼 */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* 메시지 */}
              {message && (
                <div className={`p-3 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              {/* 1. 프로필 이미지 업로드 + 미리보기 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  프로필 이미지
                </label>
                <div className="flex gap-4">
                  {/* 업로드 영역 */}
                  <div className="flex-1">
                    {form.프로필이미지 ? (
                      <div className="relative group">
                        <img
                          src={form.프로필이미지}
                          alt="프로필 이미지"
                          className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="이미지 삭제"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                          uploading
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]'
                        }`}
                      >
                        {uploading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-blue-600">업로드 중...</p>
                          </>
                        ) : (
                          <>
                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-xs text-gray-500">클릭 또는 드래그 (WebP, 100KB 이하)</p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageFile(file)
                        e.target.value = ''
                      }}
                    />
                  </div>

                  {/* 라이브 미리보기 카드 */}
                  {form.프로필이미지 && (
                    <div className="w-36 flex-shrink-0">
                      <p className="text-[10px] text-gray-500 mb-1 text-center">미리보기</p>
                      <div className="w-36 h-44 rounded-lg overflow-hidden border-2 border-white/[0.08] bg-white/[0.04]">
                        <img
                          src={form.프로필이미지}
                          alt="미리보기"
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: `${imgPos.x}% ${imgPos.y}%`,
                            transform: `scale(${imgPos.zoom / 100})`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. 이미지 위치 조정 슬라이더 */}
              {form.프로필이미지 && (
                <div className="bg-white/[0.04] rounded-xl p-4 space-y-3">
                  <p className="text-xs font-medium text-gray-400">이미지 위치 조정</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-500">X 위치: {imgPos.x}%</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={imgPos.x}
                        onChange={(e) => setField('이미지위치', formatImagePosition(Number(e.target.value), imgPos.y, imgPos.zoom))}
                        className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Y 위치: {imgPos.y}%</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={imgPos.y}
                        onChange={(e) => setField('이미지위치', formatImagePosition(imgPos.x, Number(e.target.value), imgPos.zoom))}
                        className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">줌: {imgPos.zoom}%</label>
                      <input
                        type="range"
                        min={50}
                        max={200}
                        value={imgPos.zoom}
                        onChange={(e) => setField('이미지위치', formatImagePosition(imgPos.x, imgPos.y, Number(e.target.value)))}
                        className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 이름 + 직책 (2열) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="emp-name" className="block text-sm font-medium text-gray-300 mb-1">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emp-name"
                    type="text"
                    value={form.이름}
                    onChange={(e) => setField('이름', e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 bg-white/[0.04]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emp-role" className="block text-sm font-medium text-gray-300 mb-1">
                    직책 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emp-role"
                    type="text"
                    value={form.직책}
                    onChange={(e) => setField('직책', e.target.value)}
                    placeholder="경영컨설턴트"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 bg-white/[0.04]"
                    required
                  />
                </div>
              </div>

              {/* 4. 한줄 소개 */}
              <div>
                <label htmlFor="emp-intro" className="block text-sm font-medium text-gray-300 mb-1">
                  한줄 소개
                </label>
                <textarea
                  id="emp-intro"
                  value={form.소개}
                  onChange={(e) => setField('소개', e.target.value)}
                  placeholder="간단한 소개를 입력해주세요"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 bg-white/[0.04] resize-none"
                />
              </div>

              {/* 5. 전문분야 뱃지 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  전문분야 <span className="text-xs text-gray-500">({totalBadges}/{MAX_BADGES}개 선택)</span>
                </label>
                <div className="space-y-3">
                  {(Object.entries(BADGE_CATEGORIES) as [keyof typeof BADGE_CATEGORIES, readonly string[]][]).map(([category, options]) => (
                    <div key={category}>
                      <p className="text-[10px] text-gray-500 mb-1.5">{category}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {options.map((option) => {
                          const selected = form[category].includes(option)
                          const disabled = !selected && totalBadges >= MAX_BADGES
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleBadge(category, option)}
                              disabled={disabled}
                              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                                selected
                                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                  : disabled
                                  ? 'bg-white/[0.02] text-gray-600 border border-white/[0.04] cursor-not-allowed'
                                  : 'bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:border-white/[0.12] hover:text-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. 순서 + 활성 토글 (2열) */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="emp-order" className="block text-sm font-medium text-gray-300 mb-1">
                    순서
                  </label>
                  <input
                    id="emp-order"
                    type="number"
                    min={1}
                    max={99}
                    value={form.순서}
                    onChange={(e) => setField('순서', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 bg-white/[0.04]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <span className="text-sm text-gray-300">활성</span>
                  <button
                    type="button"
                    onClick={() => setField('활성여부', !form.활성여부)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                      form.활성여부 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={form.활성여부}
                    aria-label="활성여부 토글"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                        form.활성여부 ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/[0.08] transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0f172e] text-white text-sm font-medium hover:bg-[#1a2540] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {saving ? '저장 중...' : editingEmployee ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────── 삭제 확인 모달 ────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141e33] rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">임직원 삭제</h3>
              <p className="text-sm text-gray-500 mb-6">
                &quot;{deleteTarget.이름}&quot; ({deleteTarget.직책})을(를) 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-white/[0.06] hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
