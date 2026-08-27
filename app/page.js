'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const IMG = '/images/landing';

// 3. 고민 — 1열 리스트 3개
const PAINS = [
  { img: 'card-cost-concern', text: '아이디어는 있지만 외주비가 부담스러웠다면' },
  { img: 'card-tutorial-fail', text: '온라인 AI 강의를 따라가다 중간에 막혔다면' },
  { img: 'card-developer-concern', text: '개발자 없이 어디서부터 시작할지 몰랐다면' },
];

// 5. 왜 40·50인가 — 경험 3카드
const EXPERIENCES = [
  { img: 'experience-construction', text: ['건축 현장 30년,', '반복되는 불편을 누구보다', '잘 아는 분'] },
  { img: 'experience-hospital', text: ['병원 근무 20년,', '환자의 불편을 가까이서', '지켜본 분'] },
  { img: 'experience-education', text: ['자녀를 대학까지 키우며', '현실적인 교육 문제를', '겪어본 분'] },
];

// 6. 오프라인 차별점 — 체크리스트
const POINTS = [
  { lead: '최대 15명 소수 정예로 ', bold: '밀착케어' },
  { lead: '내 사업 아이템으로 ', bold: '직접 실습' },
  { lead: '막히는 부분 ', bold: '현장에서 해결' },
  { lead: '실제 서비스 ', bold: '제작 및 배포까지' },
];

// 7. 4주 후 남는 3가지
// TODO: 이미지는 모델 사진 대신 실제 제작 화면(로그인·예약·결제 화면 등)으로 교체 필요
const REWARDS = [
  {
    label: '첫번째', no: '01', img: 'reward-01-service',
    title: '직접 실행되는 웹·앱 첫 버전',
    lead: '다른 사람에게 보여주고 ', bold: '사용해볼 수 있는 결과물입니다.',
  },
  {
    label: '두번째', no: '02', img: 'reward-02-skill',
    title: '스스로 수정하는 능력',
    lead: 'AI에게 원하는 내용을 요청하고 ', bold: '화면과 기능을 바꾸는 방법을 배웁니다.',
  },
  {
    label: '세번째', no: '03', img: 'reward-03-strategy',
    title: '스타트업 기초 전략',
    lead: '아이디어 검증부터 운영까지 ', bold: '스타트업 전략도 함께 배웁니다.',
  },
];

// 강사 소개
// TODO: 실제 얼굴 사진 + 검증 가능한 경력(회사명·연차·출시 서비스) 추가
const COACHES = [
  { name: '민아', role: '프로덕트 디자이너', desc: '실제 웹·앱 서비스의 브랜드와 화면 설계를 도와드립니다.' },
  { name: '진형', role: '개발자', desc: 'AI 코딩으로 기능을 만들고 오류를 해결하는 과정을 함께합니다.' },
  { name: '기획 담당', role: '', desc: '아이디어를 고객이 사용할 수 있는 사업 구조로 정리합니다.' },
];

// 8. 커리큘럼
const CURRICULUM = [
  { part: 'PART 1', step: '기획', title: '내 사업 아이디어 정리', desc: '누구를 위한 어떤 서비스인지 정리합니다.', result: '시장 · 타깃 · 문제 · 솔루션 · 회원 유형 · 메뉴 · 주요 프로세스' },
  { part: 'PART 2', step: '디자인', title: '브랜드와 화면 설계', desc: '이름, 분위기, 주요 화면을 직접 구성합니다.', result: '내 서비스의 무드보드' },
  { part: 'PART 3', step: '바이브 코딩', title: 'AI로 실제 기능 제작', desc: '기획과 디자인을 바탕으로 작동하는 웹·앱을 만듭니다.', result: '다른 사람도 접속할 수 있는 나의 서비스' },
  { part: 'PART 4', step: '오픈', title: '테스트와 오픈', desc: '다른 사람에게 보여주고 수정한 뒤 공개합니다.', result: '아이디어 검증 방법' },
];

// 사전 수업 참여자 이야기 — 핵심 3개, 만든 결과 표시
const REVIEWS = [
  { who: '박○규 · 51 · 자영업', result: '예약 접수 서비스', text: '3년 전에 외주 견적 듣고 포기했던 아이디어를 여기서 3주 만에 직접 만들었습니다. 지금 가게에서 실제로 쓰고 있어요.' },
  { who: '송○철 · 55 · 공인중개사', result: '매물 문의 정리 도구', text: '상담만 받아보자 했다가 그날 등록했습니다. 사무실 직원이 저보다 더 잘 씁니다. 15명뿐이라 한 명 한 명 다 챙겨주는 게 느껴졌어요.' },
  { who: '강○원 · 52 · 요식업', result: '배달 주문 페이지', text: '아들이 신청해줘서 얼떨결에 시작했는데 지금은 제가 더 빠져 있습니다. 2호점 내는 대신 배달 주문 페이지를 직접 만드는 중이에요.' },
];

// 히어로 바로 아래 핵심 정보 요약
const STATS = [
  ['개강', '9월 7일'],
  ['수업', '총 8회 · 회당 3시간'],
  ['장소', '교대역 오프라인'],
  ['정원', '최대 15명'],
];

// FAQ — 답변은 페이지 사실 기반 초안, 확정 전 검토 필요
const FAQS = [
  ['컴퓨터를 잘 다루지 못해도 가능한가요?', '네. 문서 작성과 인터넷 검색 정도만 할 수 있으면 충분합니다. 필요한 도구 설치부터 하나씩 같이 진행합니다.'],
  ['코딩을 전혀 몰라도 되나요?', '네. 코드는 AI가 작성하고, 우리는 AI에게 정확하게 요청하는 방법을 배웁니다. 코딩 경험은 필요 없습니다.'],
  ['아이디어가 구체적이지 않아도 되나요?', '괜찮습니다. 1주 차 기획 과정에서 아이디어를 서비스 구조로 함께 정리합니다.'],
  ['4주 안에 어디까지 만들 수 있나요?', '다른 사람이 접속해서 사용할 수 있는 웹·앱 첫 버전까지 만들고 공개하는 것이 목표입니다.'],
  ['앱스토어 출시까지 포함되나요?', '기본 과정은 웹 서비스 제작과 배포까지입니다. 앱스토어 출시가 필요한 경우 상담 때 별도로 안내드립니다.'],
  ['수업을 놓치면 어떻게 하나요?', '신청 시 가능한 시간대를 미리 조율하고, 빠진 부분은 다음 수업에서 따라잡을 수 있도록 도와드립니다.'],
  ['1강 무료 수강 후 반드시 결제해야 하나요?', '아니요. 첫 강의를 들어보고 계속할지 결정하시면 됩니다. 결제는 그다음입니다.'],
  ['개인 노트북은 어떤 사양이 필요한가요?', '최근 몇 년 내 구매한 노트북이면 충분합니다. 인터넷 브라우저가 원활히 동작하면 됩니다.'],
];

// 강의 장소 — 카카오맵 퍼가기 (교대역 현민빌딩)
const KAKAO_MAP = { timestamp: '1787733490512', key: '2hsu2qz5jcn7' };
function KakaoMap() {
  const box = useRef(null);
  useEffect(() => {
    // 로더가 document.write로 2단계 스크립트(Lander)를 붙이는데 동적 로딩에선 무시되므로 직접 로드
    if (!document.querySelector('script[data-roughmap]')) {
      const s = document.createElement('script');
      s.src = 'https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js';
      s.dataset.roughmap = '1';
      s.onload = () => {
        const rm = window.daum.roughmap;
        if (rm.Lander) return;
        const s2 = document.createElement('script');
        s2.src = `${rm.url_protocal}//t1.kakaocdn.net/kakaomapweb/roughmap/place/${rm.phase}/${rm.cdn}/roughmapLander.js`;
        document.body.appendChild(s2);
      };
      document.body.appendChild(s);
    }
    // Lander 준비될 때까지 폴링 후 렌더 (onload 타이밍 레이스 회피)
    let tries = 0;
    const t = setInterval(() => {
      const el = document.getElementById(`daumRoughmapContainer${KAKAO_MAP.timestamp}`);
      if (window.daum?.roughmap?.Lander && el) {
        if (!el.hasChildNodes()) {
          new window.daum.roughmap.Lander({
            timestamp: KAKAO_MAP.timestamp,
            key: KAKAO_MAP.key,
            mapWidth: String(box.current?.clientWidth || 640),
            mapHeight: '320',
          }).render();
        }
        clearInterval(t);
      } else if (++tries > 50) clearInterval(t);
    }, 200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="map-box" ref={box}>
      <div id={`daumRoughmapContainer${KAKAO_MAP.timestamp}`} className="root_daum_roughmap root_daum_roughmap_landing" />
    </div>
  );
}

// 줄바꿈 배열을 <br/>로 이어 붙임
const lines = (arr) => arr.map((t, i) => (i === 0 ? t : [<br key={i} />, t]));

// B코스만 진행
const COURSE_B = {
  days: [7, 9, 14, 16, 21, 22, 28, 30],
};

// 가격 포함 내용
const INCLUDES = ['기획·디자인·개발 현직자 코칭', '수업용 템플릿과 실습 자료', '내 아이디어 기반 웹·앱 제작', '결과물 점검과 수정 피드백'];

// 2026년 9월 캘린더 — 9/1이 화요일(일=0 기준 index 2)
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const SEPT_FIRST_WEEKDAY = 2;
const SEPT_DAYS = 30;

const SITE = 'https://www.secondcareerlab.kr';

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
          name: 'AI로 내 온라인 서비스 직접 만들기',
          courseMode: 'Onsite',
          courseWorkload: 'PT24H',
          description: '하루 3시간 · 총 8회 · 4주 완성',
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
  const [errs, setErrs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showBar, setShowBar] = useState(false);

  // 모바일 하단 CTA 노출
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openModal = (location) => {
    track('상담신청클릭', { location });
    track('신청1진입');
    setErrs({});
    setStep(1);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim();
    const age = f.age.value.trim();
    const phone = f.phone.value.trim();
    const times = [...f.querySelectorAll('input[name=time]:checked')].map((i) => i.value);

    const next = {
      name: !name,
      age: !/^\d{1,3}$/.test(age),
      phone: !/^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/.test(phone),
      time: times.length === 0,
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
        body: JSON.stringify({ course: 'B', times }),
      });
      if (!res2.ok) throw new Error('submit failed');
      const TIME_CODE = { 오전반: 'mo', 오후반: 'af', 심야반: 'ni' };
      track('신청완료', { name, phone, age, type: 'b', time: times.map((t) => TIME_CODE[t]).join(',') });
      setStep(5);
    } catch {
      setErrs({ ...next, submit: true });
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
          <nav className="gnb" aria-label="섹션 이동">
            <a href="#rewards" onClick={() => track('상단바클릭', { menu: '얻는것' })}>얻는것</a>
            <a href="#price" onClick={() => track('상단바클릭', { menu: '비용' })}>비용</a>
            <a href="#curriculum" onClick={() => track('상단바클릭', { menu: '커리큘럼' })}>커리큘럼</a>
            <a href="#info" onClick={() => track('상단바클릭', { menu: '강의정보' })}>강의정보</a>
          </nav>
          <button className="btn btn-primary" onClick={() => openModal('up')}>첫 강의 무료신청</button>
        </div>
      </header>

      <main>
        {/* 2. 첫 화면 */}
        {/* TODO: 키비주얼을 1:1 코칭 실사 이미지로 교체 (hero-bg.png / hero-mobile.png) */}
        <section className="hero" id="top">
          <div className="wrap hero-inner">
            <p><span className="hero-over">40·50대 예비 대표님을 위한 오프라인 실습</span></p>
            <h1>
              아이디어만 가져오세요.<br />
              <span className="grad">4주 동안 내 사업의 웹·앱을<br className="br-m" /> 직접 만듭니다.</span>
            </h1>
            <p className="hero-sub">AI 코딩이 처음이어도 괜찮습니다.<br />기획자·디자이너·개발자가 옆에서 처음부터 함께합니다.</p>
          </div>
        </section>

        {/* 2.5 핵심 정보 요약 — 히어로 바로 아래 한 번만 */}
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
            <h2>이 중 하나라도<br />내 이야기라면</h2>
            <div className="pain-list stagger">
              {PAINS.map((p) => (
                <div className="prow" key={p.img}>
                  <Image src={`${IMG}/${p.img}.png`} alt="" width={520} height={520} />
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
            <p className="punch">
              <span className="grad"><em className="dots">그래서</em> 직접 만들 수 있게 도와드립니다.</span>
            </p>
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
            <span className="eyebrow">온라인 강의와 가장 다른 점</span>
            <h2><span className="grad">바로 옆에서 함께 만든다는 것</span></h2>
            <ul className="check-list stagger">
              {POINTS.map((p) => (
                <li key={p.bold}>
                  <span className="chk" aria-hidden="true">✓</span>
                  <span>{p.lead}<b>{p.bold}</b></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. 4주 후 남는 3가지 */}
        <section className="reward" id="rewards">
          <div className="wrap reveal">
            <div className="reward-head">
              <div>
                <span className="eyebrow">수료 후</span>
                <h2>4주 후,<br />이 3가지가 남습니다</h2>
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

        {/* 7.5 강사 소개 */}
        <section className="coach center">
          <div className="wrap reveal">
            <span className="eyebrow">함께하는 사람들</span>
            <h2>기획자·디자이너·개발자가<br />처음부터 함께합니다</h2>
            <div className="card-grid-3 stagger">
              {COACHES.map((c) => (
                <div className="icard coach-card" key={c.name}>
                  {/* TODO: 실제 얼굴 사진으로 교체 */}
                  <div className="coach-avatar" aria-hidden="true">{c.name[0]}</div>
                  <h3>{c.name}{c.role && <span> · {c.role}</span>}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. 커리큘럼 */}
        <section className="curr center" id="curriculum">
          <div className="wrap reveal">
            <span className="eyebrow">커리큘럼</span>
            <h2><mark>기획부터 오픈 이후까지</mark></h2>
            <div className="curr-card stagger">
              {CURRICULUM.map((c) => (
                <div className="crow" key={c.part}>
                  <div className="cpart"><b>{c.part}</b><span>{c.step}</span></div>
                  <div className="cbody">
                    <h3>{c.title}</h3>
                    <p>{c.desc}<br /><b>결과물: {c.result}</b></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9.5 사전 수업 참여자 이야기 — 세로 1열 3개 */}
        <section className="reviews center">
          <div className="wrap reveal">
            <span className="eyebrow">사전 수업 참여자 이야기</span>
            <h2>먼저 해본 분들의 이야기</h2>
            <div className="rv-list stagger">
              {REVIEWS.map((r) => (
                <figure className="rv-card" key={r.who}>
                  <blockquote>{r.text}</blockquote>
                  <figcaption>
                    {r.who}
                    <span className="rv-result">완성 결과: {r.result}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 9.7 강의 일정 · 가격 (B코스만 진행) */}
        <section className="info center" id="info">
          <div className="wrap reveal">
            <span className="eyebrow">강의 정보</span>
            <h2>강의 일정과 가격</h2>
            <div className="info-grid stagger">
              <div className="info-card wide">
                <h3>강의 장소</h3>
                <p className="place-name">3호선 교대역 인근 · 세영빌딩 2층</p>
                <p className="place-addr">서울 서초구 서초중앙로20길 35 세영빌딩 2층</p>
                <KakaoMap />
                <a
                  className="place-link"
                  href="https://naver.me/58NbQ9qg"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('지도클릭', { app: '네이버' })}
                >
                  네이버지도로 보기 →
                </a>
              </div>
              <div className="info-card">
                <h3>강의 진행 예정일</h3>
                <p className="sched-lines">
                  <b>9월 7일 첫 수업</b><br />
                  총 8회 · 회당 3시간
                </p>
                <div className="calendar">
                  <p className="cal-title">2026년 9월</p>
                  <div className="cal-grid">
                    {WEEKDAYS.map((w) => <span key={w} className="cal-dow">{w}</span>)}
                    {Array.from({ length: SEPT_FIRST_WEEKDAY }).map((_, i) => <span key={`b${i}`} />)}
                    {Array.from({ length: SEPT_DAYS }, (_, i) => i + 1).map((d) => (
                      <span key={d} className={`cal-day${COURSE_B.days.includes(d) ? ' on' : ''}`}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="info-card" id="price">
                <h3>강의 가격</h3>
                <p className="free-first">
                  <b>먼저 1강을 무료로 들어보세요.</b><br />
                  계속할지 결정한 뒤 결제하시면 됩니다.
                </p>
                <div className="price-box">
                  <p className="p-price">4주 총 96만원</p>
                  <p className="p-meta">총 8회 · 24시간</p>
                </div>
                <ul className="includes">
                  {INCLUDES.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <div className="info-card wide">
                <h3>강의 준비물</h3>
                <p className="supply">💻 노트북 한 대</p>
                <p className="supply-wit">코딩 실력은 안 챙겨오셔도 됩니다.<br />그건 AI가 가져오거든요.</p>
              </div>
            </div>
            <p className="punch">
              <span className="grad"><em className="dots">결제는</em> 첫강의 듣고 나서 하시면 돼요!</span>
            </p>
          </div>
        </section>

        {/* 9.9 FAQ */}
        <section className="faq center" id="faq">
          <div className="wrap reveal">
            <span className="eyebrow">자주 묻는 질문</span>
            <h2>신청 전에 궁금한 것들</h2>
            <div className="faq-list stagger">
              {FAQS.map(([q, a]) => (
                <details className="faq-item" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 10. 최종 CTA */}
        <section className="cta center">
          <div className="wrap reveal">
            <h2>9월 7일, 내 아이디어의<br />첫 화면을 만들어보세요</h2>
            <p className="cta-sub">
              1강을 무료로 듣고<br />
              <b>계속할지는 그다음에 결정하시면 됩니다.</b>
            </p>
            <button className="btn-pill" onClick={() => openModal('bottom')}>
              <span className="grad">첫 강의 무료신청</span>
            </button>
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
        <button className="btn btn-primary" onClick={() => openModal('flo')}>첫 강의 무료 신청</button>
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
              <h3>첫 강의 신청을 위해 몇 가지만 알려주세요</h3>
              <form onSubmit={onSubmit} noValidate>
                <div className="form-field">
                  <label htmlFor="fName">이름</label>
                  <input type="text" id="fName" name="name" autoComplete="name" required />
                  {errs.name && <p className="f-error">이름을 입력해주세요.</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="fAge">나이</label>
                  <div className="input-suffix">
                    <input type="text" id="fAge" name="age" inputMode="numeric" placeholder="50" required />
                    <span className="suffix">세</span>
                  </div>
                  {errs.age && <p className="f-error">나이를 정확히 입력해주세요.</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="fPhone">휴대폰 번호</label>
                  <input type="tel" id="fPhone" name="phone" autoComplete="tel" inputMode="numeric" placeholder="01012345678" required />
                  {errs.phone && <p className="f-error">휴대폰 번호를 정확히 입력해주세요.</p>}
                </div>
                <div className="form-field">
                  <span className="f-label">
                    선호 시간대 <span style={{ color: 'var(--primary)', fontSize: 14 }}>복수 선택 가능</span>
                  </span>
                  <p className="f-hint-strong">가능한 시간대를 모두 선택해 주세요.</p>
                  <label className="time-opt"><input type="checkbox" name="time" value="오전반" />오전반<span className="t-range">09:00 ~ 12:00</span></label>
                  <label className="time-opt"><input type="checkbox" name="time" value="오후반" />오후반<span className="t-range">14:00 ~ 17:00</span></label>
                  <label className="time-opt"><input type="checkbox" name="time" value="심야반" />심야반<span className="t-range">19:00 ~ 22:00</span></label>
                  {errs.time && <p className="f-error">시간대를 하나 이상 선택해주세요.</p>}
                </div>
                <p className="consent-note">신청 시 개인정보 수집 및 이용에 동의한 것으로 간주합니다. 상담 및 안내 목적으로만 사용되며, 그 외의 용도로는 사용하지 않습니다.</p>
                {errs.submit && <p className="f-error">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>}
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? '처리 중…' : '첫 강의 무료신청'}</button>
                </div>
              </form>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="done-box">
                <div className="d-ico">✓</div>
                <h3>첫 강의 신청이 완료되었습니다.</h3>
                <p><strong>강의 장소 및 추가 정보는<br />휴대폰 번호로 안내드리겠습니다.</strong></p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={closeModal}>확인</button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      )}
    </>
  );
}
