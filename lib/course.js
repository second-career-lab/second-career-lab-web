// 강의 정보 — 랜딩(app/page.js)과 신청 페이지(app/apply/page.js) 공용

// B안 반 선택 목록. lead는 DB에 저장되는 기존 시간대 값
export const CLASSES = [
  { id: 'A', time: '오전 9시~12시', open: '9월 7일 개강', meta: '매주 월/수 · 총 8회 · 서울 교대역 인근', lead: '오전반' },
  { id: 'B', time: '오후 2시~5시', open: '9월 7일 개강', meta: '매주 월/수 · 총 8회 · 서울 교대역 인근', lead: '오후반' },
  { id: 'C', time: '오후 7시~10시', open: '9월 7일 개강', meta: '매주 월/수 · 총 8회 · 서울 교대역 인근', lead: '심야반' },
];

// B코스만 진행
export const COURSE_B = {
  old: '1,200,000원',
  now: '960,000원',
  meta: '하루 3시간 · 총 8회 · 4주 과정',
  days: [7, 9, 14, 16, 21, 22, 28, 30],
};
