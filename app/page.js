'use client';

import { useEffect, useRef, useState } from 'react';

const COURSES = {
  A: {
    name: 'A. 빠른 완성 코스',
    old: '900,000원',
    now: '720,000원',
    meta: '하루 3시간 · 총 6회 · 2주 과정',
    dates: ['9/7(월) · 9/9(수) · 9/11(금)', '9/14(월) · 9/16(수) · 9/18(금)'],
  },
  B: {
    name: 'B. 여유로운 완성 코스',
    old: '1,200,000원',
    now: '960,000원',
    meta: '하루 3시간 · 총 8회 · 4주 과정',
    dates: ['9/7(월) · 9/9(수) · 9/14(월) · 9/16(수)', '9/21(월) · 9/22(화) · 9/28(월) · 9/30(수)'],
  },
};

const SITE = 'https://secondcareerlab.vercel.app';

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
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'IT 지식이나 코딩 경험이 전혀 없어도 수강할 수 있나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '네. 이 클래스는 IT 지식과 코딩 경험이 없는 40·50대 예비 창업가를 위해 설계됐습니다. AI와 대화하며 만드는 바이브코딩 방식으로, 기획부터 디자인·제작·배포까지 강사가 옆에서 함께 진행합니다.',
          },
        },
        {
          '@type': 'Question',
          name: '수강료는 얼마인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A. 빠른 완성 코스(2주, 총 6회)는 900,000원에서 20% 할인된 720,000원, B. 여유로운 완성 코스(4주, 총 8회)는 1,200,000원에서 20% 할인된 960,000원입니다. 두 코스 모두 하루 3시간 오프라인 수업입니다.',
          },
        },
        {
          '@type': 'Question',
          name: '온라인으로도 수강할 수 있나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '아니요, 오프라인 전용입니다. 보고 끝나는 강의가 아니라 내 사업 아이템으로 직접 실습하고, 막히는 부분을 현장에서 바로 해결하기 위해 최대 15명 소수 정예 오프라인으로만 진행합니다.',
          },
        },
        {
          '@type': 'Question',
          name: '수업이 끝나면 무엇을 가져가게 되나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '세 가지입니다. 첫째, 내 사업 아이디어로 만든 실제 서비스 결과물(배포 포함). 둘째, 다음 아이디어도 직접 수정하고 다시 만들 수 있는 능력. 셋째, 아이템 검증·PMF·피봇·마케팅·운영까지 스타트업 기본기입니다.',
          },
        },
        {
          '@type': 'Question',
          name: '상담 신청을 하면 바로 결제해야 하나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '아니요, 상담 신청은 결제가 아닙니다. 이름·연락처·선호 시간대를 남기시면 담당자가 24시간 이내에 연락드려 일정과 커리큘럼을 안내해드립니다.',
          },
        },
      ],
    },
  ],
};

const FAQS = JSON_LD['@graph'][2].mainEntity;

export default function Page() {
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const [step, setStep] = useState(1);
  const [courseKey, setCourseKey] = useState(null);
  const [errs, setErrs] = useState({});
  const [dday, setDday] = useState(null);
  const [showBar, setShowBar] = useState(false);

  // 개강 D-day + 모바일 하단 CTA 노출
  useEffect(() => {
    const d = Math.ceil((new Date('2026-09-07T00:00:00+09:00') - Date.now()) / 86400000);
    setDday(d);
    const onScroll = () => setShowBar(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const course = courseKey ? COURSES[courseKey] : null;

  const openModal = () => {
    setCourseKey(null);
    setErrs({});
    setStep(1);
    dialogRef.current?.showModal();
  };
  const closeModal = () => dialogRef.current?.close();
  const goto = (n) => setStep(n);

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

  const onSubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim();
    const phone = f.phone.value.trim();
    const times = [...f.querySelectorAll('input[name=time]:checked')].map((i) => i.value);

    const next = {
      name: !name,
      phone: !/^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/.test(phone),
      time: times.length === 0,
    };
    setErrs(next);
    if (Object.values(next).some(Boolean)) return;

    // ponytail: 백엔드 미정 — 접수처(스프레드시트/DB/API) 정해지면 여기서 전송
    console.log('상담 신청:', { course: courseKey, name, phone, times });

    f.reset();
    setStep(4);
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
          <button className="btn btn-primary" onClick={openModal}>상담 신청하기</button>
        </div>
      </header>

      <main>
        {/* 2. 첫 화면 */}
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="live-badge">
                <span className="dot" />9월 기수 모집 중{dday > 0 && <> · 개강 D-{dday}</>}
              </span>
              <span className="eyebrow">40·50대 창업가를 위한</span>
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
              <div className="cta-area">
                <button className="btn btn-primary btn-lg btn-pulse" onClick={openModal}>상담 신청하기 →</button>
                <p className="cap">최대 15명 소수 정예</p>
                <p className="cap-sub">상담 신청은 결제가 아닙니다 · 24시간 내 연락드립니다</p>
              </div>
            </div>

            {/* AI 데모: 대화 → 화면 생성 */}
            <div className="demo-card" aria-hidden="true">
              <div className="chat">
                <div className="bubble user b1">사장님, 예약 받을 수 있는<br />홈페이지 하나 만들어줘</div>
                <div className="bubble ai b2">네, 바로 만들어드릴게요 ✨</div>
              </div>
              <div className="mini-site">
                <div className="mini-chrome">
                  <span /><span /><span />
                  <div className="mini-url">내-서비스.com</div>
                </div>
                <div className="mini-body">
                  <div className="mini-nav el e1"><i /><b /></div>
                  <div className="mini-hero el e2"><i /><i className="short" /></div>
                  <div className="mini-cards el e3"><span /><span /><span /></div>
                  <div className="mini-btn el e4">예약하기</div>
                </div>
              </div>
              <p className="demo-cap">AI와 대화하면, 화면이 이렇게 만들어집니다</p>
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
            <span className="eyebrow">왜 4050인가?</span>
            <h2>경험은 이미 있습니다.<br />이제 만드는 장벽이 낮아졌습니다.</h2>
            <div className="chips">
              <span>업무 경험</span><span>사업 경험</span><span>전문지식</span>
            </div>
            <p className="body">
              지금까지 쌓아온 경험을<br /><strong>AI와 함께 온라인 비즈니스로 만들어보세요.</strong>
            </p>
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
                <h3>스타트업 기본기</h3>
                <p>아이템 검증 · PMF · 피봇 · 마케팅 · 운영까지 <strong>사업에 필요한 기본기를 함께 배웁니다.</strong></p>
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
                  <p>전환율 · 퍼널 · 리텐션 · PMF · 피봇 · 초기 마케팅</p>
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
              <li>40~50대 예비 창업가</li>
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

        {/* FAQ */}
        <section className="faq center" id="faq">
          <div className="wrap reveal">
            <span className="eyebrow">자주 묻는 질문</span>
            <h2>궁금한 점을 확인하세요</h2>
            <div className="faq-list">
              {FAQS.map((f) => (
                <details key={f.name}>
                  <summary>{f.name}</summary>
                  <p>{f.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 11. 모집 안내 */}
        <section className="recruit center">
          <div className="wrap reveal">
            <span className="eyebrow">모집 안내 · 밀착 실습을 위해</span>
            <h2>최대 15명만 모집합니다.</h2>
            <p className="lead">내 머릿속 아이디어를<br />이번에는 실제 서비스로 만들어보세요.</p>

            <div className="plan-grid">
              {['A', 'B'].map((k) => {
                const c = COURSES[k];
                return (
                  <button key={k} className="plan" onClick={() => { setCourseKey(k); setStep(2); dialogRef.current?.showModal(); }}>
                    <span className="pl-tag">{k === 'A' ? '2주 완성' : '4주 완성'}</span>
                    <span className="pl-name">{c.name}</span>
                    <span className="pl-meta">{c.meta}</span>
                    <span className="pl-price"><s>{c.old}</s><b>{c.now}</b></span>
                    <span className="pl-go">자세히 보고 신청 →</span>
                  </button>
                );
              })}
            </div>

            <div className="cta-area">
              <button className="btn btn-primary btn-lg btn-pulse" onClick={openModal}>상담 신청하기 →</button>
              <p className="note">상담 신청은 결제가 아닙니다 · 24시간 내 연락드립니다</p>
            </div>
          </div>
        </section>
      </main>

      <footer>© 2026 세컨드커리어랩</footer>

      {/* 모바일 하단 고정 CTA */}
      <div className={`mobile-cta${showBar ? ' show' : ''}`}>
        <button className="btn btn-primary" onClick={openModal}>상담 신청하기 · 최대 15명</button>
      </div>

      {/* 상담 신청 팝업 */}
      <dialog ref={dialogRef} aria-label="상담 신청">
        <div className="modal-body" ref={bodyRef}>
          {step === 1 && (
            <div>
              <p className="modal-step-label">STEP 1 · 코스 선택</p>
              <h3>어떤 일정이 더 잘 맞으시나요?</h3>
              {['A', 'B'].map((k) => {
                const c = COURSES[k];
                return (
                  <button key={k} className="course-card" onClick={() => { setCourseKey(k); setStep(2); }}>
                    <span className="c-name">{c.name}</span>
                    <p className="c-meta">{k === 'A' ? '하루 3시간 · 총 6회 · 월/수/금' : '하루 3시간 · 총 8회 · 월/목'}</p>
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
              <div className="modal-actions">
                <div className="row"><button className="btn btn-ghost" onClick={closeModal}>닫기</button></div>
              </div>
            </div>
          )}

          {step === 2 && course && (
            <div>
              <p className="modal-step-label">STEP 2 · 가격 확인</p>
              <div className="price-box">
                <p className="p-name">{course.name}</p>
                <p className="p-old">{course.old}</p>
                <p className="p-now">{course.now}<span className="p-badge">20% 할인</span></p>
                <p className="p-meta">{course.meta}</p>
                <p className="p-note">지금 결제하는 단계가 아닙니다.<br /><strong>가격 확인 후 상담 신청을 이어가주세요.</strong></p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => goto(3)}>이어서 신청하기</button>
                <div className="row">
                  <button className="btn btn-ghost" onClick={() => goto(1)}>이전</button>
                  <button className="btn btn-ghost" onClick={closeModal}>닫기</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && course && (
            <div>
              <p className="modal-step-label">STEP 3 · 정보 입력</p>
              <h3>상담 정보를 남겨주세요</h3>
              <form onSubmit={onSubmit} noValidate>
                <div className="form-field">
                  <label htmlFor="fName">이름</label>
                  <input type="text" id="fName" name="name" autoComplete="name" required />
                  {errs.name && <p className="f-error">이름을 입력해주세요.</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="fPhone">휴대폰 번호</label>
                  <input type="tel" id="fPhone" name="phone" autoComplete="tel" inputMode="numeric" placeholder="010-0000-0000" required />
                  {errs.phone && <p className="f-error">휴대폰 번호를 정확히 입력해주세요.</p>}
                </div>
                <div className="form-field">
                  <span className="f-label">강의 진행 예정일</span>
                  <div className="sched-box">
                    {course.dates.map((line) => <div key={line}>{line}</div>)}
                  </div>
                  <p className="sched-note">※ 날짜는 일정 안내용으로만 노출됩니다.</p>
                </div>
                <div className="form-field">
                  <span className="f-label">
                    선호 시간대 <span style={{ color: 'var(--primary)', fontSize: 14 }}>복수 선택 가능</span>
                  </span>
                  <label className="time-opt"><input type="checkbox" name="time" value="오전반" />오전반<span className="t-range">09:00 ~ 12:00</span></label>
                  <label className="time-opt"><input type="checkbox" name="time" value="오후반" />오후반<span className="t-range">14:00 ~ 17:00</span></label>
                  <label className="time-opt"><input type="checkbox" name="time" value="저녁반" />저녁반<span className="t-range">19:00 ~ 22:00</span></label>
                  <p className="f-hint">가능한 시간대를 모두 선택해주세요.</p>
                  {errs.time && <p className="f-error">시간대를 하나 이상 선택해주세요.</p>}
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">상담 신청 완료</button>
                  <div className="row">
                    <button type="button" className="btn btn-ghost" onClick={() => goto(2)}>이전</button>
                    <button type="button" className="btn btn-ghost" onClick={closeModal}>닫기</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {step === 4 && (
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
      </dialog>
    </>
  );
}
