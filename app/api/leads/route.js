import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export async function POST(req) {
  const body = await req.json();
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const age = Number(body.age);
  const idea = String(body.idea || '').trim().slice(0, 200) || null;

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
    .insert({ name, phone, age, idea })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
