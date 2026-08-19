'use client';

import { useEffect, useRef, useState } from 'react';

const COURSES = {
  A: {
    name: 'A. 빠른 완성 코스',
    old: '900,000원',
    now: '720,000원',
    meta: '하루 3시간 · 총 6회 · 2주 과정',
    days: [7, 9, 11, 14, 16, 18],
  },
  B: {
    name: 'B. 여유로운 완성 코스',
    old: '1,200,000원',
    now: '960,000원',
    meta: '하루 3시간 · 총 8회 · 4주 과정',
    days: [7, 9, 14, 16, 21, 22, 28, 30],
  },
};

// 2026년 9월 캘린더 — 9/1이 화요일(일=0 기준 index 2)
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const SEPT_FIRST_WEEKDAY = 2;
const SEPT_DAYS = 30;

const SITE = 'https://secondcareerlab.vercel.app';

const track = (name, props) => window.amplitude?.track(name, props);

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#org`,
      name: '세컨드커리어랩',
      url: `${SITE}/`,
    },
    {
      '@type': 'Course',
      name: 'AI로 내 온라인 서비스 직접 만들기',
      description:
        '40·50대 창업가를 위한 오프라인 실전 클래스. IT 지식 없이 기획·디자인·바이브코딩으로 내 사업 아이디어를 실제 서비스로 만들고 배포까지 진행합니다.',
      provider: { '@id': `${SITE}/#org` },
      coursePrerequisites: '없음 — IT 지식·코딩 경험 불필요',
      hasCourseInstance: [
        {
          '@type': 'CourseInstance',
          name: 'A. 빠른 완성 코스',
          courseMode: 'Onsite',
          courseWorkload: 'PT18H',
          description: '하루 3시간 · 총 6회 · 월/수/금 · 2주 완성',
          offers: { '@type': 'Offer', price: '720000', priceCurrency: 'KRW', availability: 'https://schema.org/LimitedAvailability' },
        },
        {
          '@type': 'CourseInstance',
          name: 'B. 여유로운 완성 코스',
          courseMode: 'Onsite',
          courseWorkload: 'PT24H',
          description: '하루 3시간 · 총 8회 · 월/목 · 4주 완성',
          offers: { '@type': 'Offer', price: '960000', priceCurrency: 'KRW', availability: 'https://schema.org/LimitedAvailability' },
        },
      ],
    },
  ],
};

export default function Page() {
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const [step, setStep] = useState(1);
  const [courseKey, setCourseKey] = useState(null);
  const [info, setInfo] = useState({ name: '', age: '', phone: '' });
  const [leadId, setLeadId] = useState(null);
  const [errs, setErrs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showBar, setShowBar] = useState(false);

  // 모바일 하단 CTA 노출
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const course = courseKey ? COURSES[courseKey] : null;

  const openModal = (location) => {
    track('상담신청클릭', { location });
    track('신청1진입');
    setCourseKey(null);
    setInfo({ name: '', age: '', phone: '' });
    setLeadId(null);
    setErrs({});
    setStep(1);
    dialogRef.current?.showModal();
  };
  const closeModal = () => dialogRef.current?.close();
  const goto = (n) => setStep(n);

  const [toastOn, setToastOn] = useState(false);
  const toastTimerRef = useRef(null);
  const showCalendarToast = () => {
    setToastOn(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastOn(false), 2000);
  };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [step]);

  // 스크롤 리빌
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      // 뷰포트 하단 240px 앞에서 미리 발동 — 빠른 스크롤에도 빈 화면이 보이지 않게
      { threshold: 0, rootMargin: '0px 0px 240px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onSubmitInfo = async (e) => {
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
      setLeadId(id);
      setInfo({ name, age, phone });
      track('신청2진입', { name, phone, age });
      setStep(2);
    } catch {
      setErrs({ ...next, submit: true });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitSchedule = async (e) => {
    e.preventDefault();
    const f = e.target;
    const times = [...f.querySelectorAll('input[name=time]:checked')].map((i) => i.value);

    if (times.length === 0) {
      setErrs((prev) => ({ ...prev, time: true }));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: courseKey, times }),
      });
      if (!res.ok) throw new Error('submit failed');
      setErrs({});
      const TIME_CODE = { 오전반: 'mo', 오후반: 'af', 저녁반: 'ni' };
      track('신청완료', {
        name: info.name,
        phone: info.phone,
        age: info.age,
        type: courseKey === 'A' ? 'a' : 'b',
        time: times.map((t) => TIME_CODE[t]).join(','),
      });
      setStep(5);
    } catch {
      setErrs({ time: false, submit: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {/* 1. 상단 고정 헤더 */}
      <header>
        <div className="header-inner">
          <a className="logo" href="#top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="세컨드커리어랩" />
          </a>
          <button className="btn btn-primary" onClick={() => openModal('up')}>상담 신청하기</button>
        </div>
      </header>

      <main>
        {/* 2. 첫 화면 */}
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="eyebrow eyebrow-lg">40·50대 대표님들을 위한</span>
              <h1>
                AI로 내 온라인 서비스<br />
                <span className="u">
                  직접 만들기
                  <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 9 C 60 3, 140 3, 197 8" stroke="#147D72" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".45" />
                  </svg>
                </span>
              </h1>
              <p className="sub">IT 지식 없이도, 비싼 외주개발 없이도.</p>
              <p className="sub" style={{ marginTop: 14 }}>
                <strong>기획부터 디자인, 바이브코딩까지<br />직접 만들어보는 오프라인 실전 클래스</strong>
              </p>
            </div>
          </div>
        </section>

        {/* 핵심 스펙 바 */}
        <div className="spec-bar">
          <div className="wrap">
            <div className="spec"><b>15명</b><span>정원</span></div>
            <div className="spec"><b>3시간</b><span>1회 수업</span></div>
            <div className="spec"><b>2~4주</b><span>완성 기간</span></div>
            <div className="spec"><b>100%</b><span>오프라인 실습</span></div>
          </div>
        </div>

        {/* 3. 이런 고민 있으셨나요? */}
        <section className="pain center">
          <div className="wrap reveal">
            <span className="eyebrow">이런 고민 있으셨나요?</span>
            <h2>아이디어는 있는데,<br />만드는 단계에서 막혔다면</h2>
            <ul className="pain-list stagger">
              <li>외주개발 비용이 너무 부담된다.</li>
              <li>개발자를 구하기도 어렵고 비싸다.</li>
              <li>AI로 만든다는데 어디서부터 해야 할지 모르겠다.</li>
              <li>유튜브를 따라 해봐도 내 서비스는 잘 안 만들어진다.</li>
            </ul>
            <p className="punch">그래서 직접 만들 수 있게 도와드립니다.</p>
          </div>
        </section>

        {/* 4. 지금은 개발 방식이 달라졌습니다 */}
        <section className="center">
          <div className="wrap reveal">
            <span className="eyebrow">지금은 개발 방식이 달라졌습니다</span>
            <div className="shift-rows">
              <div className="shift-row shift-old">
                <div className="tag">예전에는</div>
                <div className="shift-flow">
                  <span className="step">아이디어</span><span className="arr">→</span>
                  <span className="step">개발사</span><span className="arr">→</span>
                  <span className="step hurt">수천만 원</span><span className="arr">→</span>
                  <span className="step hurt">수개월 개발</span>
                </div>
              </div>
              <div className="shift-row shift-new">
                <div className="tag">지금은</div>
                <div className="shift-flow">
                  <span className="step">아이디어</span><span className="arr">→</span>
                  <span className="step">AI와 대화</span><span className="arr">→</span>
                  <span className="step hot">직접 제작</span><span className="arr">→</span>
                  <span className="step hot">빠르게 검증</span>
                </div>
              </div>
            </div>
            <p className="shift-punch">개발자가 아니어도<br /><mark>서비스를 만들 수 있는 시대</mark>입니다.</p>
          </div>
        </section>

        {/* 5. 왜 4050인가? */}
        <section className="why center">
          <div className="wrap reveal">
            <span className="eyebrow eyebrow-lg">왜 4050인가?</span>
            <h2>이제 아이디어를 개발하는<br />장벽은 낮아졌습니다.</h2>
            <p className="body body-lg">
              대신, 무엇을 만들지 아는<br /><strong>경험과 전문성이 더 중요해졌습니다.</strong>
            </p>
            <ul className="pain-list stagger">
              <li>건축 현장 30년, 반복되는 불편을 누구보다 잘 아는 분</li>
              <li>병원 근무 20년, 환자의 불편을 가까이서 지켜본 분</li>
              <li>자녀를 대학까지 키우며 현실적인 교육 문제를 겪어본 분</li>
            </ul>
            <p className="punch">지금까지 쌓아온 경험과 지식이<br />하나의 서비스가 될 수 있습니다.</p>
          </div>
        </section>

        {/* 6. 오프라인으로 합니다 */}
        <section className="offline center">
          <div className="wrap reveal">
            <span className="eyebrow">온라인이 아니라 오프라인으로 합니다</span>
            <h2>보고 끝나는 강의가 아닙니다.</h2>
            <p className="punch">옆에서 같이 만듭니다.</p>
            <div className="feature-grid stagger">
              <div className="card"><span className="ico">👥</span>최대 15명 소수 정예</div>
              <div className="card"><span className="ico">💡</span>내 사업 아이템으로 직접 실습</div>
              <div className="card"><span className="ico">🙋</span>막히는 부분 현장에서 해결</div>
              <div className="card"><span className="ico">🚀</span>실제 서비스 제작 및 배포까지</div>
            </div>
          </div>
        </section>

        {/* 7. 3가지를 가져갑니다 */}
        <section className="takeaway center">
          <div className="wrap reveal">
            <span className="eyebrow">수료 후</span>
            <h2>3가지를 가져갑니다</h2>
            <div className="take-grid stagger">
              <div className="take-card">
                <div className="no">01</div>
                <h3>실제 서비스 결과물</h3>
                <p>내 사업 아이디어를 <strong>직접 서비스 형태로 만들어봅니다.</strong></p>
              </div>
              <div className="take-card">
                <div className="no">02</div>
                <h3>스스로 만드는 능력</h3>
                <p>다음 아이디어가 생겨도 <strong>직접 수정하고 다시 만들 수 있습니다.</strong></p>
              </div>
              <div className="take-card">
                <div className="no">03</div>
                <h3>스타트업 기초 전략</h3>
                <p>아이디어 검증 방법부터 운영까지 <strong>스타트업 기초 전략도 함께 배웁니다.</strong></p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. 커리큘럼 */}
        <section className="center">
          <div className="wrap reveal">
            <span className="eyebrow">커리큘럼</span>
            <h2>기획부터 오픈 이후까지</h2>
            <div className="curriculum-list stagger">
              <div className="curr-item">
                <div className="part">PART 1<br />기획</div>
                <div>
                  <h3>무엇을 만들지 명확하게 정리</h3>
                  <p>시장 · 타깃 · 문제 · 솔루션 · 회원 유형 · 메뉴 · 주요 프로세스</p>
                </div>
              </div>
              <div className="curr-item">
                <div className="part">PART 2<br />디자인</div>
                <div>
                  <h3>AI에게 원하는 화면을 정확하게 요청하는 방법</h3>
                </div>
              </div>
              <div className="curr-item">
                <div className="part">PART 3<br />바이브코딩</div>
                <div>
                  <h3>기획과 디자인을 바탕으로 실제 서비스 제작</h3>
                  <p>다른 사람도 접속할 수 있도록 <strong>배포까지 진행합니다.</strong></p>
                </div>
              </div>
              <div className="curr-item">
                <div className="part">PART 4<br />오픈 이후</div>
                <div>
                  <h3>만들고 끝이 아닙니다.</h3>
                  <p>오픈 후 어떻게 아이디어를 검증할지도 함께 배웁니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. 이런 분에게 추천합니다 */}
        <section className="for-whom center">
          <div className="wrap reveal">
            <span className="eyebrow">이런 분에게 추천합니다</span>
            <h2>이 클래스가 꼭 맞는 분</h2>
            <ul className="pain-list stagger">
              <li>40~50대 예비 대표님</li>
              <li>온라인 비즈니스를 시작하고 싶은 분</li>
              <li>외주개발 비용이 부담되는 분</li>
              <li>내 경험을 서비스로 만들고 싶은 분</li>
              <li>AI를 혼자 배우기 어려웠던 분</li>
            </ul>
          </div>
        </section>

        {/* 10. 이번 강의의 목표 */}
        <section className="goal center">
          <div className="wrap reveal">
            <span className="eyebrow">이번 강의의 목표</span>
            <p className="deny">AI를 배우는 것이 목표가 아닙니다.</p>
            <p className="affirm">내 아이디어를<br />직접 만들고 검증할 수 있는<br />사람이 되는 것.</p>
          </div>
        </section>

        {/* 11. 모집 안내 */}
        <section className="recruit center">
          <div className="wrap reveal">
            <span className="eyebrow">모집 안내 · 밀착 실습을 위해</span>
            <h2>최대 15명만 모집합니다.</h2>
            <p className="lead">내 머릿속 아이디어를<br />이번에는 실제 서비스로 만들어보세요.</p>

            <div className="cta-area">
              <button className="btn btn-primary btn-lg btn-pulse" onClick={() => openModal('bottom')}>상담 신청하기 →</button>
              <p className="note">상담 신청은 결제가 아닙니다 · 24시간 내 연락드립니다</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 세컨드커리어랩</p>
        <p className="footer-links">
          <a href="https://lacy-jasmine-edf.notion.site/3c1b3600bb79802cb357d43d52106435?source=copy_link" target="_blank" rel="noopener noreferrer">서비스 이용약관</a>
          <span className="footer-divider">·</span>
          <a href="https://lacy-jasmine-edf.notion.site/3c1b3600bb79806eac5ff53af5337b1d?source=copy_link" target="_blank" rel="noopener noreferrer">개인정보 처리방침</a>
        </p>
      </footer>

      {/* 모바일 하단 고정 CTA */}
      <div className={`mobile-cta${showBar ? ' show' : ''}`}>
        <button className="btn btn-primary" onClick={() => openModal('flo')}>상담 신청하기 · 최대 15명</button>
      </div>

      {/* 상담 신청 팝업 */}
      <dialog ref={dialogRef} aria-label="상담 신청">
        <div className="modal-body" ref={bodyRef}>
          {step === 1 && (
            <div>
              <div className="modal-top-bar">
                <button type="button" className="modal-close-x" onClick={closeModal} aria-label="닫기">×</button>
              </div>
              <p className="modal-step-label">STEP 1 · 정보 입력</p>
              <h3>상담을 위해 몇 가지만 알려주세요</h3>
              <form onSubmit={onSubmitInfo} noValidate>
                <div className="form-field">
                  <label htmlFor="fName">이름</label>
                  <input type="text" id="fName" name="name" autoComplete="name" defaultValue={info.name} required />
                  {errs.name && <p className="f-error">이름을 입력해주세요.</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="fAge">나이</label>
                  <div className="input-suffix">
                    <input type="text" id="fAge" name="age" inputMode="numeric" placeholder="50" defaultValue={info.age} required />
                    <span className="suffix">세</span>
                  </div>
                  {errs.age && <p className="f-error">나이를 정확히 입력해주세요.</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="fPhone">휴대폰 번호</label>
                  <input type="tel" id="fPhone" name="phone" autoComplete="tel" inputMode="numeric" placeholder="01012345678" defaultValue={info.phone} required />
                  {errs.phone && <p className="f-error">휴대폰 번호를 정확히 입력해주세요.</p>}
                </div>
                <p className="consent-note">신청 시 개인정보 수집 및 이용에 동의한 것으로 간주합니다. 상담 및 안내 목적으로만 사용되며, 그 외의 용도로는 사용하지 않습니다.</p>
                {errs.submit && <p className="f-error">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>}
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? '처리 중…' : '상담신청'}</button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="modal-top-bar">
                <button type="button" className="modal-close-x" onClick={closeModal} aria-label="닫기">×</button>
              </div>
              <p className="modal-step-label">STEP 2 · 코스 선택</p>
              <p className="modal-lead modal-lead-lg">원활한 상담을 위해 몇 가지만 더 여쭤볼게요</p>
              <h3>어떤 일정이 더 잘 맞으시나요?</h3>
              {['A', 'B'].map((k) => {
                const c = COURSES[k];
                return (
                  <button
                    key={k}
                    className="course-card"
                    onClick={() => {
                      track('신청3진입', { name: info.name, phone: info.phone, age: info.age, type: k === 'A' ? 'a' : 'b' });
                      setCourseKey(k);
                      setStep(3);
                    }}
                  >
                    <span className="c-name">{c.name}</span>
                    <p className="c-meta">
                      하루 3시간 · <span className="c-count">{k === 'A' ? '총 6회' : '총 8회'}</span> · {k === 'A' ? '월/수/금' : '월/목'}
                    </p>
                    <span className="c-big">{k === 'A' ? '2주 만에 완성' : '4주 만에 완성'}</span>
                    <p className="c-desc">
                      {k === 'A'
                        ? '짧은 기간 동안 집중해서 서비스를 완성하고 싶은 분께 추천합니다.'
                        : '조금 더 여유 있게 배우고 실습하고 싶은 분께 추천합니다.'}
                    </p>
                    <span className="c-go">{k}코스 선택 →</span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 3 && course && (
            <div>
              <div className="modal-top-bar">
                <button type="button" className="modal-back" onClick={() => goto(2)}>← 이전</button>
                <button type="button" className="modal-close-x" onClick={closeModal} aria-label="닫기">×</button>
              </div>
              <p className="modal-step-label">STEP 3 · 가격 확인</p>
              <div className="price-box">
                <p className="p-name">{course.name}</p>
                <p className="p-old">{course.old}</p>
                <p className="p-now">{course.now}<span className="p-badge">20% 할인</span></p>
                <p className="p-meta">{course.meta}</p>
                <p className="p-note">결제는 상담 이후 진행돼요</p>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    track('신청4진입', { name: info.name, phone: info.phone, age: info.age, type: courseKey === 'A' ? 'a' : 'b' });
                    goto(4);
                  }}
                >다음</button>
              </div>
            </div>
          )}

          {step === 4 && course && (
            <div>
              <div className="modal-top-bar">
                <button type="button" className="modal-back" onClick={() => goto(3)}>← 이전</button>
                <button type="button" className="modal-close-x" onClick={closeModal} aria-label="닫기">×</button>
              </div>
              <p className="modal-step-label">STEP 4 · 일정 선택</p>
              <h3>강의 진행 예정일을 확인해주세요</h3>
              <form onSubmit={onSubmitSchedule} noValidate>
                <div className="form-field">
                  <span className="f-label">강의 진행 예정일</span>
                  <p className="cal-dates">{course.days.map((d) => `9/${d}(${WEEKDAYS[(SEPT_FIRST_WEEKDAY + d - 1) % 7]})`).join(', ')}</p>
                  <div className="calendar" onClick={showCalendarToast} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && showCalendarToast()}>
                    <p className="cal-title">2026년 9월</p>
                    <div className="cal-grid">
                      {WEEKDAYS.map((w) => <span key={w} className="cal-dow">{w}</span>)}
                      {Array.from({ length: SEPT_FIRST_WEEKDAY }).map((_, i) => <span key={`b${i}`} />)}
                      {Array.from({ length: SEPT_DAYS }, (_, i) => i + 1).map((d) => (
                        <span key={d} className={`cal-day${course.days.includes(d) ? ' on' : ''}`}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-field">
                  <span className="f-label">
                    선호 시간대 <span style={{ color: 'var(--primary)', fontSize: 14 }}>복수 선택 가능</span>
                  </span>
                  <p className="f-hint-strong">가능한 시간대를 모두 선택해 주세요.</p>
                  <label className="time-opt"><input type="checkbox" name="time" value="오전반" />오전반<span className="t-range">09:00 ~ 12:00</span></label>
                  <label className="time-opt"><input type="checkbox" name="time" value="오후반" />오후반<span className="t-range">14:00 ~ 17:00</span></label>
                  <label className="time-opt"><input type="checkbox" name="time" value="저녁반" />저녁반<span className="t-range">19:00 ~ 22:00</span></label>
                  {errs.time && <p className="f-error">시간대를 하나 이상 선택해주세요.</p>}
                  {errs.submit && <p className="f-error">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>}
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? '처리 중…' : '완료'}</button>
                </div>
              </form>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="done-box">
                <div className="d-ico">✓</div>
                <h3>상담 신청이 완료되었습니다.</h3>
                <p>담당자가 신청 내용을 확인한 후<br /><strong>24시간 이내 입력하신 휴대폰 번호로<br />연락드리겠습니다.</strong></p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={closeModal}>확인</button>
              </div>
            </div>
          )}
        </div>
        {toastOn && <div className="toast">강의 일정은 변경할 수 없습니다.</div>}
      </dialog>
    </>
  );
}
