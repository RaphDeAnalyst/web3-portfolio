import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getAllChartsAdmin } from '@/lib/dune-cache-service'

function getJwtSecret(): Uint8Array {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(s)
}

async function isAdminAuthed(): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')?.value
    if (!token) return false
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function GET(_request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const charts = await getAllChartsAdmin()
    return NextResponse.json({ charts })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch charts' },
      { status: 500 },
    )
  }
}
