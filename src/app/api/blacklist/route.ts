import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { normalizePhone } from "@/lib/phone";

const AIRTABLE_BASE_ID = "appvXvzEaBRCvmTyU";
const TABLE = "블랙리스트";
const LEADS_TABLE = "고객접수";

interface BlacklistRecord {
  id: string;
  연락처: string;
  사유: string;
  등록일시: string;
  등록자: string;
  차단횟수: number;
  마지막차단일시: string;
}

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) throw new Error("AIRTABLE_TOKEN not configured");
  return new Airtable({ apiKey: token }).base(AIRTABLE_BASE_ID);
}

// ─── GET — 블랙리스트 목록 + 통계 ───
export async function GET() {
  try {
    const base = getBase();
    const records: BlacklistRecord[] = [];

    await new Promise<void>((resolve, reject) => {
      base(TABLE)
        .select({
          maxRecords: 500,
          sort: [{ field: "등록일시", direction: "desc" }],
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => {
              records.push({
                id: r.id,
                연락처: String(r.get("연락처") || ""),
                사유: String(r.get("사유") || ""),
                등록일시: String(r.get("등록일시") || ""),
                등록자: String(r.get("등록자") || ""),
                차단횟수: Number(r.get("차단횟수") || 0),
                마지막차단일시: String(r.get("마지막차단일시") || ""),
              });
            });
            fetchNextPage();
          },
          (err) => (err ? reject(err) : resolve()),
        );
    });

    // 통계 — 누적 차단 + 최근 7일 차단 합계
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    let totalBlocks = 0;
    let recentBlocks = 0;
    for (const r of records) {
      totalBlocks += r.차단횟수;
      if (r.마지막차단일시) {
        const t = new Date(r.마지막차단일시).getTime();
        if (!isNaN(t) && t >= sevenDaysAgo) recentBlocks += 1;
      }
    }

    return NextResponse.json({
      success: true,
      records,
      stats: {
        total: records.length,
        totalBlocks,
        recentBlocks,
      },
    });
  } catch (error) {
    console.error("[BOAS/blacklist] GET error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

// ─── POST — 신규 등록 (옵션: leadId 있으면 해당 리드를 '스팸'으로 변경) ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phoneRaw = String(body?.연락처 || "").trim();
    const reason = String(body?.사유 || "").trim();
    const leadId = body?.leadId ? String(body.leadId) : "";
    const registeredBy = String(body?.등록자 || "admin").trim();

    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "유효한 연락처가 필요합니다." },
        { status: 400 },
      );
    }

    const base = getBase();

    // 중복 체크
    const existing = await new Promise<string | null>((resolve, reject) => {
      base(TABLE)
        .select({
          maxRecords: 1,
          filterByFormula: `{연락처} = '${phone.replace(/'/g, "\\'")}'`,
        })
        .firstPage((err, recs) => {
          if (err) reject(err);
          else resolve(recs && recs.length > 0 ? recs[0].id : null);
        });
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "이미 등록된 연락처입니다.", id: existing },
        { status: 409 },
      );
    }

    const nowIso = new Date().toISOString();
    const created = await base(TABLE).create({
      연락처: phone,
      사유: reason,
      등록일시: nowIso,
      등록자: registeredBy,
      차단횟수: 0,
    });

    // leadId가 같이 왔으면 해당 리드 상태 = '스팸'으로 변경
    if (leadId) {
      try {
        await base(LEADS_TABLE).update(leadId, { 상태: "스팸" });
      } catch (e) {
        console.error(
          "[BOAS/blacklist] lead status update failed:",
          (e as Error).message,
        );
      }
    }

    return NextResponse.json({
      success: true,
      id: created.id,
      연락처: phone,
    });
  } catch (error) {
    console.error("[BOAS/blacklist] POST error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

// ─── DELETE — 해제 ───
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "id가 필요합니다." },
        { status: 400 },
      );
    }
    const base = getBase();
    await base(TABLE).destroy(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BOAS/blacklist] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
