'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COURSE_LABEL = { A: 'A. 빠른 완성 코스', B: 'B. 여유로운 완성 코스' };
const STATUSES = ['대기', '완료'];

export default function LeadsTable({ leads }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState(null);
  const [savingMemoId, setSavingMemoId] = useState(null);

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

  const deleteLead = async (l) => {
    if (!window.confirm(`'${l.name} / ${l.phone}' 신청 내역을 삭제할까요?`)) return;
    setPendingId(l.id);
    await fetch(`/api/admin/leads/${l.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleted: true }),
    });
    setPendingId(null);
    router.refresh();
  };

  const saveMemo = async (id, memo) => {
    setSavingMemoId(id);
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo }),
    });
    setSavingMemoId(null);
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
            <th>삭제</th>
            <th>신청일시</th>
            <th>이름</th>
            <th>휴대폰번호</th>
            <th>나이</th>
            <th>코스</th>
            <th>선호시간대</th>
            <th>상태</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>
                <button
                  type="button"
                  className="admin-delete-btn"
                  disabled={pendingId === l.id}
                  onClick={() => deleteLead(l)}
                >
                  삭제
                </button>
              </td>
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
              <td>
                <textarea
                  className="admin-memo"
                  defaultValue={l.memo || ''}
                  placeholder="상담 메모, 링크 등을 입력하세요"
                  disabled={savingMemoId === l.id}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== (l.memo || '')) saveMemo(l.id, value);
                  }}
                />
                {savingMemoId === l.id && <p className="admin-memo-saving">저장 중…</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
