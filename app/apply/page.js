'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CLASSES, COURSE_B } from '../../lib/course';

// 랜딩과 동일하게 모든 이벤트에 variant 첨부
const track = (name, props) => {
  let v = 'A';
  try { v = localStorage.getItem('ab_variant') === 'B' ? 'B' : 'A'; } catch { /* noop */ }
  window.amplitude?.track(name, { ...props, variant: v });
};

export default function ApplyPage() {
  const router = useRouter();
  const [cls, setCls] = useState(null);
  const [showOthers, setShowOthers] = useState(false);
  const [errs, setErrs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('class');
    const v = CLASSES.some((c) => c.id === p) ? p : 'A';
    setCls(v);
    track('신청폼진입', { class: v });
  }, []);

  const c = CLASSES.find((x) => x.id === cls);
  if (!c) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim();
    const age = f.age.value.trim();
    const phone = f.phone.value.trim();

    const next = {
      name: !name,
      age: !/^\d{1,3}$/.test(age),
      phone: !/^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/.test(phone),
    };
    setErrs(next);
    if (Object.values(next).some(Boolean)) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age: Number(age), phone }),
      });
      if (!res.ok) throw new Error('submit failed');
      const { id } = await res.json();
      const res2 = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: 'B', times: [c.lead] }),
      });
      if (!res2.ok) throw new Error('submit failed');
      const TIME_CODE = { 오전반: 'mo', 오후반: 'af', 심야반: 'ni' };
      track('신청완료', { name, phone, age, type: 'b', time: TIME_CODE[c.lead], class: c.id });
      setDone(true);
      window.scrollTo(0, 0);
    } catch {
      setErrs({ ...next, submit: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="apply-page">
        <div className="apply-wrap">
          <div className="done-box" style={{ paddingTop: 80 }}>
            <div className="d-ico">✓</div>
            <h3>첫 강의 신청이 완료되었습니다.</h3>
            <p><strong>강의 장소 및 추가 정보는<br />휴대폰 번호로 안내드리겠습니다.</strong></p>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => router.push('/')}>확인</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-top">
        <button type="button" className="apply-back" onClick={() => router.back()} aria-label="뒤로가기">‹</button>
      </div>
      <div className="apply-wrap">
        <h1 className="apply-title">AI로 내 온라인 서비스<br />직접 만들기 1기</h1>

        {/* 선택한 반 */}
        <div className="sel-card">
          <p className="sc-head"><b>{c.id}반 · {c.time}</b> · {c.open}</p>
          <p className="sc-row">🕐 매주 월/수 · 총 8회 · 하루 3시간</p>
          <p className="sc-row">📍 서울 교대역 인근</p>
          <p className="sc-row">👥 최대 15명 소수 정예</p>
        </div>
        <button type="button" className="other-btn" onClick={() => setShowOthers(!showOthers)}>
          다른 반 선택 {showOthers ? '▴' : '▾'}
        </button>
        {showOthers && CLASSES.filter((x) => x.id !== c.id).map((x) => (
          <button
            type="button"
            key={x.id}
            className="class-opt"
            onClick={() => { setCls(x.id); setShowOthers(false); track('반선택', { class: x.id }); }}
          >
            <span className="co-radio" aria-hidden="true" />
            <span className="co-name">{x.id}반</span>
            <span className="co-body">
              <span className="co-line"><b>{x.time}</b> · {x.open}</span>
              <span className="co-meta">{x.meta}</span>
            </span>
          </button>
        ))}

        {/* 가격 */}
        <div className="sf-row apply-price">
          <p className="mc-off"><b>20%</b><s>￦{COURSE_B.old.replace('원', '')}</s></p>
          <p className="mc-now">￦{COURSE_B.now.replace('원', '')}</p>
        </div>

        {/* 안내 박스 */}
        <div className="apply-note-box">
          <p className="anb-title">1회차 무료 · 듣고 나서 결정하세요</p>
          <p className="anb-desc">첫 강의를 직접 들어보고 결정하세요.<br />결제는 첫 강의 이후에 하시면 됩니다.</p>
        </div>

        {/* 신청 폼 */}
        <form id="applyForm" onSubmit={onSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="aName">이름 *</label>
            <input type="text" id="aName" name="name" autoComplete="name" placeholder="홍길동" required />
            {errs.name && <p className="f-error">이름을 입력해주세요.</p>}
          </div>
          <div className="form-field">
            <label htmlFor="aPhone">전화번호 *</label>
            <input type="tel" id="aPhone" name="phone" autoComplete="tel" inputMode="numeric" placeholder="01012345678" required />
            <p className="f-help">수업 안내 사항을 보내드립니다.</p>
            {errs.phone && <p className="f-error">휴대폰 번호를 정확히 입력해주세요.</p>}
          </div>
          <div className="form-field">
            <label htmlFor="aAge">나이 *</label>
            <div className="input-suffix">
              <input type="text" id="aAge" name="age" inputMode="numeric" placeholder="50" required />
              <span className="suffix">세</span>
            </div>
            {errs.age && <p className="f-error">나이를 정확히 입력해주세요.</p>}
          </div>
          <p className="consent-note">신청 시 개인정보 수집 및 이용에 동의한 것으로 간주합니다. 상담 및 안내 목적으로만 사용되며, 그 외의 용도로는 사용하지 않습니다.</p>
          {errs.submit && <p className="f-error">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>}
        </form>
      </div>

      {/* 하단 고정 CTA */}
      <div className="apply-cta-bar">
        <button type="submit" form="applyForm" className="mc-btn sheet-cta" disabled={submitting}>
          {submitting ? '처리 중…' : '첫 강의 무료 신청'}
        </button>
        <p className="sheet-note"><b>1회차 무료</b> · 듣고 나서 결정하세요</p>
      </div>
    </div>
  );
}
