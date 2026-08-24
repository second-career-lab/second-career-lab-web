import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../lib/supabase-admin';

const COURSES = ['A', 'B'];
const TIMES = ['오전반', '오후반', '심야반'];

export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const course = COURSES.includes(body.course) ? body.course : null;
  const times = Array.isArray(body.times) ? body.times.filter((t) => TIMES.includes(t)) : [];

  if (!course || times.length === 0) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from('leads')
    .update({ course, times, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
