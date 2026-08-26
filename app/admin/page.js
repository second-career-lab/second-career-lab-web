import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '../../lib/supabase-admin';
import { isValidSession, ADMIN_COOKIE_NAME } from '../../lib/admin-auth';
import LeadsTable from './LeadsTable';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSession(session)) redirect('/admin/login');

  const { data: leads, error } = await getSupabaseAdmin()
    .from('leads')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return (
    <main className="admin-wrap">
      <h1>상담 신청 내역</h1>
      {error ? (
        <p className="f-error">{error.message}</p>
      ) : (
        <>
          <p className="admin-total">총 <strong>{leads?.length || 0}</strong>명 신청</p>
          <LeadsTable leads={leads || []} />
        </>
      )}
    </main>
  );
}
