'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COURSE_LABEL = { A: 'A. 빠른 완성 코스', B: 'B. 여유로운 완성 코스' };
const STATUSES = ['대기', '완료'];

export default function LeadsTable({ leads }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState(null);

  const changeStatus = async (id, status) => {
    setPendingId(id);
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setPendingId(null);
    router.refresh();
  };

  if (leads.length === 0) {
    return <p className="admin-empty">아직 신청 내역이 없습니다.</p>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>신청일시</th>
            <th>이름</th>
            <th>휴대폰번호</th>
            <th>나이</th>
            <th>코스</th>
            <th>선호시간대</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{new Date(l.created_at).toLocaleString('ko-KR')}</td>
              <td>{l.name}</td>
              <td>{l.phone}</td>
              <td>{l.age}세</td>
              <td>{l.course ? COURSE_LABEL[l.course] : '-'}</td>
              <td>{l.times?.length ? l.times.join(', ') : '-'}</td>
              <td>
                <select
                  className="admin-status-select"
                  value={l.status}
                  disabled={pendingId === l.id}
                  onChange={(e) => changeStatus(l.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
