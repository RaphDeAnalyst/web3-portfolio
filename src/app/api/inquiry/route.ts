import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const wallet  = typeof body?.wallet  === 'string' ? body.wallet.trim()  : ''
  const details = typeof body?.details === 'string' ? body.details.trim() : ''

  if (!wallet || !details) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const timestamp = new Date().toUTCString()

  try {
    await resend.emails.send({
      from:    'inquiries@matthewraphael.xyz',
      to:      'matthewraphael@matthewraphael.xyz',
      subject: 'New inquiry — matthewraphael.xyz',
      text: [
        'New inquiry submitted via matthewraphael.xyz/services',
        '',
        'WALLET / TX HASH',
        wallet,
        '',
        'WHAT HAPPENED',
        details,
        '',
        '---',
        `Submitted: ${timestamp}`,
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
