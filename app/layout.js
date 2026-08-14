import Script from 'next/script';
import './globals.css';

const SITE = 'https://secondcareerlab.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE),
  title: 'AI로 내 온라인 서비스 직접 만들기 — 40·50대 창업가 오프라인 클래스 | 세컨드커리어랩',
  description:
    'IT 지식 없이, 외주개발 없이 내 사업 아이디어를 직접 서비스로 만듭니다. 기획·디자인·바이브코딩·배포까지, 최대 15명 소수 정예 오프라인 실전 클래스. 2주 완성(96만원) 또는 4주 완성(72만원) 코스.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '세컨드커리어랩',
    title: 'AI로 내 온라인 서비스 직접 만들기 — 40·50대 창업가 오프라인 클래스',
    description:
      'IT 지식 없이, 외주개발 없이. 기획부터 배포까지 직접 만드는 최대 15명 소수 정예 오프라인 실전 클래스.',
    url: '/',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI로 내 온라인 서비스 직접 만들기 — 40·50대 창업가 오프라인 클래스',
    description:
      'IT 지식 없이, 외주개발 없이. 기획부터 배포까지 직접 만드는 최대 15명 소수 정예 오프라인 실전 클래스.',
    images: ['/og.png'],
  },
};

export const viewport = { themeColor: '#147D72' };

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 히어로에 즉시 필요한 웨이트만 선로딩 */}
        <link rel="preload" href="/fonts/Pretendard-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Pretendard-900.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
      <Script id="amplitude-init" strategy="afterInteractive">
        {`
          var s = document.createElement('script');
          s.src = 'https://cdn.amplitude.com/libs/analytics-browser-2.11.9-min.js.gz';
          s.onload = function () {
            amplitude.init('${process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY}', { autocapture: true });
          };
          document.head.appendChild(s);
        `}
      </Script>
    </html>
  );
}
