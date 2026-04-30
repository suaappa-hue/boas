"use client";

import { useEffect, useState, useCallback } from "react";
import { normalizePhone } from "@/lib/phone";

interface BlacklistRecord {
  id: string;
  연락처: string;
  사유: string;
  등록일시: string;
  등록자: string;
  차단횟수: number;
  마지막차단일시: string;
}

interface Stats {
  total: number;
  totalBlocks: number;
  recentBlocks: number;
}

function formatKstDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BlacklistPage() {
  const [records, setRecords] = useState<BlacklistRecord[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    totalBlocks: 0,
    recentBlocks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addPhone, setAddPhone] = useState("");
  const [addReason, setAddReason] = useState("");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/blacklist");
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error("blacklist fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async () => {
    const phone = normalizePhone(addPhone);
    if (!phone) {
      showToast("error", "유효한 연락처를 입력하세요.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 연락처: phone, 사유: addReason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `${phone} 등록됨`);
        setShowAddModal(false);
        setAddPhone("");
        setAddReason("");
        fetchData();
      } else if (res.status === 409) {
        showToast("error", "이미 등록된 연락처입니다.");
      } else {
        showToast("error", data.error || "등록 실패");
      }
    } catch {
      showToast("error", "네트워크 오류");
    } finally {
      setAdding(false);
    }
  };

  const handleRelease = async (record: BlacklistRecord) => {
    if (!confirm(`"${record.연락처}" 차단을 해제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/blacklist?id=${record.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRecords((prev) => prev.filter((r) => r.id !== record.id));
        setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        showToast("success", `${record.연락처} 해제됨`);
      } else {
        showToast("error", "해제 실패");
      }
    } catch {
      showToast("error", "네트워크 오류");
    }
  };

  const filteredRecords = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.연락처.toLowerCase().includes(q) ||
      r.사유.toLowerCase().includes(q) ||
      r.등록자.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            🚫 블랙리스트
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            차단된 연락처는 신규 리드 접수 시 자동으로 &apos;스팸&apos;
            처리됩니다
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium whitespace-nowrap"
        >
          + 직접 추가
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#0d1829] rounded-xl p-4 border border-white/[0.06]">
          <p className="text-xs text-gray-400 mb-1">전체 등록</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#0d1829] rounded-xl p-4 border border-red-500/20">
          <p className="text-xs text-gray-400 mb-1">누적 차단 횟수</p>
          <p className="text-2xl font-bold text-red-400">{stats.totalBlocks}</p>
        </div>
        <div className="bg-[#0d1829] rounded-xl p-4 border border-white/[0.06]">
          <p className="text-xs text-gray-400 mb-1">최근 7일 차단</p>
          <p className="text-2xl font-bold text-amber-400">
            {stats.recentBlocks}
          </p>
        </div>
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 연락처, 사유, 등록자로 검색..."
          className="w-full bg-[#0d1829] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
        />
      </div>

      {/* 리스트 */}
      <div className="bg-[#0d1829] rounded-2xl overflow-hidden border border-white/[0.06]">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            불러오는 중...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            {search ? "검색 결과 없음" : "등록된 블랙리스트가 없습니다"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] text-gray-400 text-xs">
                <tr>
                  <th className="text-left p-3 whitespace-nowrap">연락처</th>
                  <th className="text-left p-3">사유</th>
                  <th className="text-left p-3 whitespace-nowrap">등록일시</th>
                  <th className="text-center p-3 whitespace-nowrap">
                    차단횟수
                  </th>
                  <th className="text-left p-3 whitespace-nowrap">
                    마지막차단
                  </th>
                  <th className="text-right p-3 whitespace-nowrap">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono text-xs text-white whitespace-nowrap">
                      {r.연락처}
                    </td>
                    <td className="p-3 text-gray-300 text-xs">
                      {r.사유 || <span className="text-gray-600">-</span>}
                    </td>
                    <td className="p-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatKstDate(r.등록일시)}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          r.차단횟수 >= 5
                            ? "bg-red-500/20 text-red-300"
                            : r.차단횟수 >= 1
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-white/[0.04] text-gray-400"
                        }`}
                      >
                        {r.차단횟수}회
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-500 whitespace-nowrap">
                      {r.마지막차단일시 ? formatKstDate(r.마지막차단일시) : "-"}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleRelease(r)}
                        className="text-xs text-gray-500 hover:text-red-400 px-2 py-1"
                      >
                        해제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 직접 추가 모달 */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !adding && setShowAddModal(false)}
        >
          <div
            className="bg-[#0d1829] rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center text-xl">
                🚫
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  블랙리스트 직접 추가
                </h3>
                <p className="text-xs text-gray-400">
                  연락처를 입력하면 자동으로 정규화됩니다
                </p>
              </div>
            </div>

            <label className="block text-xs text-gray-400 mb-1">연락처 *</label>
            <input
              type="text"
              value={addPhone}
              onChange={(e) => setAddPhone(e.target.value)}
              placeholder="010-1234-5678 또는 +821012345678"
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg p-3 text-sm text-white mb-1 focus:outline-none focus:border-white/20"
              disabled={adding}
            />
            {addPhone && (
              <p className="text-xs text-gray-500 mb-3">
                정규화:{" "}
                <span className="font-mono text-gray-300">
                  {normalizePhone(addPhone) || "-"}
                </span>
              </p>
            )}

            <label className="block text-xs text-gray-400 mb-1 mt-3">
              차단 사유 (선택)
            </label>
            <textarea
              value={addReason}
              onChange={(e) => setAddReason(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/20"
              rows={3}
              placeholder="예) 반복 접수, 봇/장난 입력 등"
              disabled={adding}
            />

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={adding}
                className="flex-1 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-sm disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleAdd}
                disabled={adding || !addPhone}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-50"
              >
                {adding ? "등록 중..." : "차단 등록"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg text-sm text-white ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
