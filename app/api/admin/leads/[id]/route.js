import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '../../../../../lib/supabase-admin';
import { isValidSession, ADMIN_COOKIE_NAME } from '../../../../../lib/admin-auth';

const STATUSES = ['대기', '부재중', '완료'];
const MEMO_MAX = 5000;

export async function PATCH(req, { params }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const update = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.memo !== undefined) {
    update.memo = String(body.memo).slice(0, MEMO_MAX);
  }
  if (body.final_decision !== undefined) {
    update.final_decision = String(body.final_decision).slice(0, 500);
  }
  if (body.deleted === true) {
    update.deleted_at = new Date().toISOString();
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  const { error } = await getSupabaseAdmin()
    .from('leads')
    .update(update)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
