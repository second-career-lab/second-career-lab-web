import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

async function notifyDiscord({ name, age, phone }) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '새 상담신청',
          color: 0x147d72,
          fields: [
            { name: '이름', value: name, inline: true },
            { name: '나이', value: `${age}세`, inline: true },
            { name: '휴대폰', value: phone, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch {
    // 알림 실패는 신청 처리에 영향 주지 않음
  }
}

export async function POST(req) {
  const body = await req.json();
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const age = Number(body.age);

  const valid =
    name &&
    /^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/.test(phone) &&
    Number.isInteger(age) &&
    age > 0 &&
    age < 150;

  if (!valid) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from('leads')
    .insert({ name, phone, age })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await notifyDiscord({ name, age, phone });
  return NextResponse.json({ id: data.id });
}
