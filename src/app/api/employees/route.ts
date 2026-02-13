import { NextRequest, NextResponse } from 'next/server'
import Airtable, { FieldSet } from 'airtable'
import { deleteR2Image } from '@/lib/r2'

const AIRTABLE_BASE_ID = 'appvXvzEaBRCvmTyU'
const EMPLOYEES_TABLE_ID = 'tblAgOg9oo7JkMhQp'

function getBase() {
  const token = process.env.AIRTABLE_TOKEN
  if (!token) throw new Error('AIRTABLE_TOKEN not configured')
  return new Airtable({ apiKey: token }).base(AIRTABLE_BASE_ID)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')

    const base = getBase()
    const records: Record<string, unknown>[] = []

    await new Promise<void>((resolve, reject) => {
      const queryOptions: Record<string, unknown> = {
        sort: [{ field: '순서', direction: 'asc' }],
      }

      if (!all) {
        queryOptions.filterByFormula = `{활성여부} = TRUE()`
      }

      base(EMPLOYEES_TABLE_ID)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select(queryOptions as any)
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((record) => {
              records.push({
                id: record.id,
                이름: record.get('이름') || '',
                직책: record.get('직책') || '',
                소개: record.get('소개') || '',
                프로필이미지: record.get('프로필이미지') || '',
                이미지위치: record.get('이미지위치') || '50% 20% 100',
                순서: record.get('순서') || 0,
                활성여부: record.get('활성여부') === true,
                자금유형: record.get('자금유형') || [],
                업무영역: record.get('업무영역') || [],
                산업분야: record.get('산업분야') || [],
              })
            })
            fetchNextPage()
          },
          (err) => {
            if (err) reject(err)
            else resolve()
          }
        )
    })

    return NextResponse.json({ success: true, employees: records })
  } catch (error) {
    console.error('[BOAS] Employees GET error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 이름, 직책, 소개, 프로필이미지, 이미지위치, 순서, 활성여부, 자금유형, 업무영역, 산업분야 } = body

    if (!이름 || !직책) {
      return NextResponse.json(
        { success: false, error: '이름과 직책은 필수입니다.' },
        { status: 400 }
      )
    }

    const base = getBase()
    const fields: Record<string, unknown> = { 이름, 직책 }

    if (소개) fields['소개'] = 소개
    if (프로필이미지) fields['프로필이미지'] = 프로필이미지
    if (이미지위치) fields['이미지위치'] = 이미지위치
    if (순서 !== undefined) fields['순서'] = Number(순서)
    if (활성여부 !== undefined) fields['활성여부'] = 활성여부
    if (자금유형) fields['자금유형'] = 자금유형
    if (업무영역) fields['업무영역'] = 업무영역
    if (산업분야) fields['산업분야'] = 산업분야

    const record = await base(EMPLOYEES_TABLE_ID).create(fields as Partial<FieldSet>)

    return NextResponse.json({ success: true, id: record.id })
  } catch (error) {
    console.error('[BOAS] Employees POST error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const base = getBase()

    if (updateData.프로필이미지 !== undefined) {
      try {
        const oldRecord = await base(EMPLOYEES_TABLE_ID).find(id)
        const oldImageUrl = oldRecord.get('프로필이미지') as string | undefined
        if (oldImageUrl && oldImageUrl !== updateData.프로필이미지) {
          await deleteR2Image(oldImageUrl)
        }
      } catch (e) {
        console.error('[BOAS] Failed to cleanup old employee image:', e)
      }
    }

    const fields: Record<string, unknown> = {}

    if (updateData.이름 !== undefined) fields['이름'] = updateData.이름
    if (updateData.직책 !== undefined) fields['직책'] = updateData.직책
    if (updateData.소개 !== undefined) fields['소개'] = updateData.소개
    if (updateData.프로필이미지 !== undefined) fields['프로필이미지'] = updateData.프로필이미지
    if (updateData.이미지위치 !== undefined) fields['이미지위치'] = updateData.이미지위치
    if (updateData.순서 !== undefined) fields['순서'] = Number(updateData.순서)
    if (updateData.활성여부 !== undefined) fields['활성여부'] = updateData.활성여부
    if (updateData.자금유형 !== undefined) fields['자금유형'] = updateData.자금유형
    if (updateData.업무영역 !== undefined) fields['업무영역'] = updateData.업무영역
    if (updateData.산업분야 !== undefined) fields['산업분야'] = updateData.산업분야

    await base(EMPLOYEES_TABLE_ID).update(id, fields)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[BOAS] Employees PUT error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const base = getBase()

    try {
      const record = await base(EMPLOYEES_TABLE_ID).find(id)
      const imageUrl = record.get('프로필이미지') as string | undefined
      if (imageUrl) {
        await deleteR2Image(imageUrl)
      }
    } catch (e) {
      console.error('[BOAS] Failed to cleanup employee image on delete:', e)
    }

    await base(EMPLOYEES_TABLE_ID).destroy(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[BOAS] Employees DELETE error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
