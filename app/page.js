'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const IMG = '/images/landing';

// 3. 고민 4카드
const PAINS = [
  { img: 'card-cost-concern', text: ['외주개발 비용이', '너무 부담된다.'] },
  { img: 'card-developer-concern', text: ['개발자를 구하기도', '어렵고 비싸다.'] },
  { img: 'card-ai-confusion', text: ['AI, 어디서부터 할지', '모르겠다.'] },
  { img: 'card-tutorial-fail', text: ['유튜브를 따라 해도', '잘 안 만들어진다.'] },
];

// 5. 왜 40·50인가 — 경험 3카드
const EXPERIENCES = [
  { img: 'experience-construction', text: ['건축 현장 30년,', '반복되는 불편을 누구보다', '잘 아는 분'] },
  { img: 'experience-hospital', text: ['병원 근무 20년,', '환자의 불편을 가까이서', '지켜본 분'] },
  { img: 'experience-education', text: ['자녀를 대학까지 키우며', '현실적인 교육 문제를', '겪어본 분'] },
];

// 6. 오프라인 차별점 4포인트
const POINTS = [
  { img: 'point-small-group', head: ['최대 ', '15명', ' 소수'], mid: '정예로', tail: '밀착케어' },
  { img: 'point-hands-on', head: ['내 사업 아이템으로'], tail: '직접 실습' },
  { img: 'point-onsite-help', head: ['막히는 부분'], tail: '현장에서 해결' },
  { img: 'point-deploy', head: ['실제 서비스'], tail: '제작 및 배포까지' },
];

// 7. 수료 후 3가지
const REWARDS = [
  {
    label: '첫번째', no: '01', img: 'reward-01-service',
    title: '실제 서비스 결과물',
    lead: '내 사업 아이디어를 ', bold: '직접 서비스 형태로 만들어봅니다.',
  },
  {
    label: '두번째', no: '02', img: 'reward-02-skill',
    title: '스스로 만드는 능력',
    lead: '다음 아이디어가 생겨도 ', bold: '직접 수정하고 다시 만들 수 있습니다.',
  },
  {
    label: '세번째', no: '03', img: 'reward-03-strategy',
    title: '스타트업 기초 전략',
    lead: '아이디어 검증부터 운영까지 ', bold: '스타트업 전략도 함께 배웁니다.',
  },
];

// 8. 커리큘럼
const CURRICULUM = [
  { part: 'PART 1', step: '기획', title: '무엇을 만들지 명확하게 정리', desc: '시장 · 타깃 · 문제 · 솔루션 · 회원 유형 · 메뉴 · 주요 프로세스' },
  { part: 'PART 2', step: '디자인', title: 'AI에게 원하는 화면을 정확하게 요청하는 방법', desc: '화면 구성 · 레이아웃 · 컬러 · 톤&매너 · 컴포넌트' },
  { part: 'PART 3', step: '바이브 코딩', title: '기획과 디자인을 바탕으로 실제 서비스 제작', desc: '다른 사람도 접속할 수 있도록 ', descBold: '배포까지 진행합니다.' },
  { part: 'PART 4', step: '오픈 이후', title: '만들고 끝이 아닙니다.', desc: '오픈 후 어떻게 아이디어를 검증할지도 함께 배웁니다.' },
];

// 9. 추천 대상 (3 + 2 배치)
const FITS = [
  { img: 'fit-preceo', text: ['40~50대 예비 대표님'] },
  { img: 'fit-online-biz', text: ['온라인 비즈니스를', '시작하고 싶은 분'] },
  { img: 'fit-outsourcing-cost', text: ['외주개발 비용이', '부담되는 분'] },
  { img: 'fit-own-experience', text: ['내 경험을 서비스로', '만들고 싶은 분'] },
  { img: 'fit-learn-ai-alone', text: ['AI를 혼자 배우기', '어려웠던 분'] },
];

const REVIEWS = [
  { who: '김○석 · 54 · 전 은행원', text: '정년 앞두고 뭐라도 해보자는 마음으로 신청했는데 솔직히 반신반의했습니다. 근데 한 달 만에 제 폰에 제가 만든 서비스가 떠 있네요. 애들한테 보여줬더니 아빠가 만든 거 맞냐고 하더라구요 ㅎㅎ' },
  { who: '이○희 · 47 · 학원 운영', text: '코딩 1도 모릅니다. 진짜 1도요. 그런 저도 따라가게 속도를 맞춰주셔서 좋았어요. 질문을 하도 많이 해서 죄송할 정도였는데 매번 제 화면을 같이 보면서 알려주셨습니다.' },
  { who: '박○규 · 51 · 자영업', text: '3년 전에 외주 견적 듣고 포기했던 아이디어를 여기서 3주 만에 직접 만들었습니다. 대단한 건 아니고 예약 받는 간단한 서비스인데, 지금 가게에서 실제로 쓰고 있어요.' },
  { who: '최○영 · 45 · 회사원', text: '3시간 수업이 길 것 같았는데 하다 보면 순식간입니다. 갈 때마다 눈에 보이게 뭔가 완성되니까 계속 하게 되더라고요. 마지막에 배포 버튼 누를 때 기분은 해본 사람만 압니다.' },
  { who: '정○호 · 58 · 퇴직', text: '제가 제일 연장자라 걱정했는데 쓸데없는 걱정이었습니다. 30년 업계 경험에서 나온 아이디어라 오히려 제일 구체적이라고 하시더군요. 그걸 그대로 서비스로 만들었습니다.' },
  { who: '한○숙 · 49 · 프리랜서', text: '유튜브 보고 혼자 해보려다 세 번 포기한 사람입니다. 막히면 그 자리에서 바로 물어볼 수 있다는 게 이렇게 큰 차이인지 몰랐어요. 돈 아깝지 않았습니다.' },
  { who: '오○진 · 43 · 마케터', text: '개발자분들이랑 회의할 때마다 답답했는데 이제 무슨 말인지 알아듣습니다. 그것만으로도 본전인데 제 이름으로 된 결과물까지 나왔으니 말 다 했죠.' },
  { who: '송○철 · 55 · 공인중개사', text: '상담만 받아보자 했다가 그날 등록했습니다. 매물 문의 정리하는 도구를 만들었는데 사무실 직원이 저보다 더 잘 씁니다. 15명뿐이라 한 명 한 명 다 챙겨주는 게 느껴졌어요.' },
  { who: '윤○미 · 46 · 간호사', text: '교대 근무라 일정이 걱정이었는데 상담 때 미리 조율해주셔서 끝까지 다녔습니다. 동기분들 나이대가 비슷해서 얘기가 잘 통하고, 수료하고도 단톡방에서 근황 나눕니다.' },
  { who: '강○원 · 52 · 요식업', text: '아들이 신청해줘서 얼떨결에 시작했는데 지금은 제가 더 빠져 있습니다. 2호점 내는 대신 배달 주문 페이지를 직접 만드는 중이에요. 인생 후반전에 이런 재미가 있을 줄 몰랐습니다.' },
];

const STATS = [
  ['정원', '15명'],
  ['1회 수업', '3시간'],
  ['완성 기간', '2~4주'],
  ['오프라인 실습 비중', '100%'],
];

// hot = 민트로 강조되는 칩
const OLD_FLOW = [{ t: '아이디어' }, { t: '개발사' }, { t: '수천만 원' }, { t: '수개월 개발' }];
const NEW_FLOW = [
  { t: '아이디어' },
  { t: 'AI에게 요청' },
  { t: '직접 제작', hot: true },
  { t: '빠르게 검증', hot: true },
];

// 줄바꿈 배열을 <br/>로 이어 붙임
const lines = (arr) => arr.map((t, i) => (i === 0 ? t : [<br key={i} />, t]));

const COURSES = {
  A: {
    name: 'A. 빠른 완성 코스',
    old: '900,000원',
    now: '720,000원',
    meta: '하루 3시간 · 총 6회 · 2주 과정',
    days: [7, 9, 10, 14, 16, 17],
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
          description: '하루 3시간 · 총 6회 · 월/수/목 · 2주 완성',
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
  // 세션 리플레이(rrweb)가 top layer의 <dialog>를 안정적으로 녹화하지 못해 일반 div 오버레이로 구현
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const goto = (n) => setStep(n);

  // <dialog>가 기본 제공하던 동작 재현: 배경 스크롤 잠금 · ESC로 닫기 · 첫 포커스
  useEffect(() => {
    if (!modalOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeModal();
    document.addEventListener('keydown', onKey);
    dialogRef.current?.querySelector('button, input')?.focus();
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [modalOpen]);

  // 포커스 트랩: 탭 키가 팝업 밖으로 나가지 않게
  const trapFocus = (e) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const f = dialogRef.current.querySelectorAll('button, input, a[href]');
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

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
      <header className={showBar ? 'tucked' : ''}>
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
          <div className="wrap hero-inner">
            <p><span className="hero-over"><b>40·50대</b> 대표님들을 위한</span></p>
            <h1>
              AI로 내 온라인 서비스<br />
              <span className="grad">직접 만들어보세요</span>
            </h1>
            <p className="hero-sub">
              IT 지식도, 비싼 외주도 필요 없습니다.<br />
              기획·디자인·바이브코딩까지, 전문가와 함께 완성하는<br />
              <strong>오프라인 실전 클래스.</strong>
            </p>
          </div>
        </section>

        {/* 핵심 스펙 바 */}
        <div className="stats">
          <div className="wrap">
            {STATS.map(([label, value]) => (
              <div className="stat" key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 이런 고민 있으셨나요? */}
        <section className="pain center">
          <div className="wrap reveal">
            <span className="eyebrow">이런 고민 있으셨나요?</span>
            <h2>아이디어는 있는데,<br />만드는 단계에서 막혔다면</h2>
            <div className="card-grid-4 stagger">
              {PAINS.map((p) => (
                <div className="icard" key={p.img}>
                  <Image src={`${IMG}/${p.img}.png`} alt="" width={520} height={520} />
                  <p>{lines(p.text)}</p>
                </div>
              ))}
            </div>
            <p className="punch">
              <span className="grad"><em className="dots">그래서</em> 직접 만들 수 있게 도와드립니다.</span>
            </p>
          </div>
        </section>

        {/* 4. 지금은 개발 방식이 달라졌습니다 */}
        <section className="shift center">
          <div className="wrap reveal">
            <span className="eyebrow">지금은 개발 방식이 달라졌습니다</span>
            <h2>개발자가 아니어도<br /><mark>서비스를 만들 수 있는 시대</mark>입니다.</h2>
            <div className="flow-box flow-old">
              <span className="flow-tag">예전에는</span>
              <div className="flow">
                {OLD_FLOW.map((s, i) => (
                  <span key={s.t} style={{ display: 'contents' }}>
                    {i > 0 && <span className="arw" aria-hidden="true">→</span>}
                    <span className="step">{s.t}</span>
                  </span>
                ))}
              </div>
            </div>
            <Image className="flow-mascot" src={`${IMG}/shift-mascot.png`} alt="" width={560} height={373} />
            <div className="flow-box flow-new">
              <span className="flow-tag">지금은</span>
              <div className="flow">
                {NEW_FLOW.map((s, i) => (
                  <span key={s.t} style={{ display: 'contents' }}>
                    {i > 0 && <span className="arw" aria-hidden="true">→</span>}
                    <span className={`step${s.hot ? ' hot' : ''}`}>{s.t}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. 왜 40·50인가? */}
        <section className="why center">
          <div className="wrap reveal">
            <span className="eyebrow">왜 <em className="dots">40·50</em>인가?</span>
            <h2>이제 아이디어를 개발하는<br />장벽은 낮아졌습니다.</h2>
            <p className="sec-sub">
              대신, ‘무엇을 만들지’ 아는 경험이 더 중요해졌습니다.<br />
              <mark><b>당신이 쌓아온 경험이 곧 하나의 서비스가 됩니다.</b></mark>
            </p>
            <div className="card-grid-3 stagger">
              {EXPERIENCES.map((e) => (
                <div className="icard" key={e.img}>
                  <Image src={`${IMG}/${e.img}.png`} alt="" width={700} height={501} />
                  <p>{lines(e.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. 오프라인으로 합니다 */}
        <section className="offline center">
          <div className="wrap reveal">
            <span className="eyebrow">온라인이 아니라 오프라인으로 합니다</span>
            <h2>보고 끝나는 강의가 아닙니다.<br /><span className="grad">옆에서 함께 만듭니다.</span></h2>
            <div className="card-grid-4 stagger">
              {POINTS.map((p, i) => (
                <div className="icard" key={p.img}>
                  <span className="pill">POINT {i + 1}</span>
                  <Image src={`${IMG}/${p.img}.png`} alt="" width={440} height={440} />
                  <p>
                    {p.head.map((t, j) => (j === 1 ? <b key={j}>{t}</b> : t))}
                    {p.mid ? <>{' '}<br className="br-m" />{p.mid}{' '}<br className="br-d" /></> : <br />}
                    <b>{p.tail}</b>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. 수료 후 3가지 */}
        <section className="reward">
          <div className="wrap reveal">
            <div className="reward-head">
              <div>
                <span className="eyebrow">수료 후</span>
                <h2>이 과정을 마친 뒤<br />3가지를 가져갑니다</h2>
              </div>
              <Image className="reward-mascot" src={`${IMG}/reward-mascot.png`} alt="" width={452} height={320} />
            </div>
            <div className="reward-rows stagger">
              {REWARDS.map((r) => (
                <div className="rrow" key={r.no}>
                  <div className="rlabel"><span>{r.label}</span></div>
                  <div className="rimg">
                    <Image src={`${IMG}/${r.img}.png`} alt="" width={700} height={467} />
                  </div>
                  <div className="rbody">
                    <p className="rno">{r.no}</p>
                    <h3 className="grad">{r.title}</h3>
                    <p>{r.lead}<b>{r.bold}</b></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. 커리큘럼 */}
        <section className="curr center">
          <div className="wrap reveal">
            <span className="eyebrow">커리큘럼</span>
            <h2><mark>기획부터 오픈 이후까지</mark></h2>
            <div className="curr-card stagger">
              {CURRICULUM.map((c) => (
                <div className="crow" key={c.part}>
                  <div className="cpart"><b>{c.part}</b><span>{c.step}</span></div>
                  <div className="cbody">
                    <h3>{c.title}</h3>
                    <p>{c.desc}{c.descBold && <b>{c.descBold}</b>}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. 이런 분에게 추천합니다 */}
        <section className="fit center">
          <div className="wrap reveal">
            <span className="eyebrow">이런 분에게 추천합니다</span>
            <h2>이 클래스가 꼭 맞는 분</h2>
            <ul className="fit-grid stagger">
              {FITS.map((f) => (
                <li key={f.img}>
                  <Image src={`${IMG}/${f.img}.png`} alt="" width={460} height={460} />
                  <p>{lines(f.text)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 9.5 수강생 후기 */}
        <section className="reviews center">
          <div className="wrap reveal">
            <span className="eyebrow">수강생 후기</span>
            <h2>먼저 해본 분들의 이야기</h2>
          </div>
          <div className="rv-rows reveal">
            {[REVIEWS.slice(0, 5), REVIEWS.slice(5)].map((row, i) => (
              <div className={`rv-marquee${i % 2 ? ' rev' : ''}`} key={i}>
                <div className="rv-track">
                  {[0, 1].map((copy) => (
                    <div className="rv-group" key={copy} aria-hidden={copy === 1}>
                      {row.map((r) => (
                        <figure className="rv-card" key={r.who}>
                          <blockquote>{r.text}</blockquote>
                          <figcaption>{r.who}</figcaption>
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. 최종 CTA */}
        <section className="cta center">
          <div className="wrap reveal">
            <span className="eyebrow">세컨드커리어랩의 목표</span>
            <h2>내 아이디어를 직접 만들고<br />검증하는 사람이 되는 것</h2>
            <p className="cta-sub">
              그래서, <b>최대 15명만</b> 모집합니다.<br />
              내 머릿속 아이디어를 실제 서비스로 만들어보세요.
            </p>
            <button className="btn-pill" onClick={() => openModal('bottom')}>
              <span className="grad">상담 신청하기</span>
            </button>
            <p className="cta-note">상담 신청은 결제가 아닙니다 · 24시간 내 연락드립니다.</p>
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
      {modalOpen && (
      <div className="modal-overlay">
      <div className="modal-box" role="dialog" aria-modal="true" aria-label="상담 신청" ref={dialogRef} onKeyDown={trapFocus}>
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
                      하루 3시간 · <span className="c-count">{k === 'A' ? '총 6회' : '총 8회'}</span> · {k === 'A' ? '월/수/목' : '월/목'}
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
      </div>
      </div>
      )}
    </>
  );
}
