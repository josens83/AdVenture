'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  const lastUpdated = '2024년 1월 15일';
  const companyName = '마케터 생존기';
  const contactEmail = 'privacy@marketer-survival.com';

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-800 rounded-xl p-8 border border-dark-700">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-dark-700">
            <Link
              href="/"
              className="text-primary-400 hover:text-primary-300 mb-4 inline-block"
            >
              ← 홈으로 돌아가기
            </Link>
            <h1 className="text-3xl font-bold mt-4">쿠키 정책</h1>
            <p className="text-dark-400 mt-2">최종 수정일: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">쿠키란 무엇인가요?</h2>
              <p className="text-dark-300 leading-relaxed">
                쿠키는 웹사이트를 방문할 때 브라우저에 저장되는 작은 텍스트 파일입니다.
                쿠키는 웹사이트가 사용자의 기기를 인식하고, 설정을 기억하며,
                더 나은 사용자 경험을 제공하는 데 도움을 줍니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">쿠키 사용 방법</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                {companyName}(이하 &quot;회사&quot;)는 다음과 같은 목적으로 쿠키를 사용합니다:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-green-400">필수 쿠키</h3>
                  <p className="text-dark-300 text-sm mb-2">
                    서비스 제공에 필수적인 쿠키로, 비활성화할 수 없습니다.
                  </p>
                  <table className="w-full text-dark-300 text-sm">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left py-2">쿠키 이름</th>
                        <th className="text-left py-2">목적</th>
                        <th className="text-left py-2">만료</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">next-auth.session-token</td>
                        <td className="py-2">로그인 세션 유지</td>
                        <td className="py-2">30일</td>
                      </tr>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">next-auth.csrf-token</td>
                        <td className="py-2">CSRF 보안</td>
                        <td className="py-2">세션</td>
                      </tr>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">next-auth.callback-url</td>
                        <td className="py-2">로그인 후 리다이렉트</td>
                        <td className="py-2">세션</td>
                      </tr>
                      <tr>
                        <td className="py-2">cookie-consent</td>
                        <td className="py-2">쿠키 동의 저장</td>
                        <td className="py-2">1년</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-dark-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-blue-400">기능 쿠키</h3>
                  <p className="text-dark-300 text-sm mb-2">
                    사용자 설정과 개인화된 기능을 제공합니다.
                  </p>
                  <table className="w-full text-dark-300 text-sm">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left py-2">쿠키 이름</th>
                        <th className="text-left py-2">목적</th>
                        <th className="text-left py-2">만료</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">theme</td>
                        <td className="py-2">다크/라이트 테마 설정</td>
                        <td className="py-2">1년</td>
                      </tr>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">language</td>
                        <td className="py-2">언어 설정</td>
                        <td className="py-2">1년</td>
                      </tr>
                      <tr>
                        <td className="py-2">game-settings</td>
                        <td className="py-2">게임 설정 (사운드, 알림 등)</td>
                        <td className="py-2">1년</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-dark-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-yellow-400">분석 쿠키</h3>
                  <p className="text-dark-300 text-sm mb-2">
                    서비스 개선을 위해 사용자 행동을 분석합니다.
                  </p>
                  <table className="w-full text-dark-300 text-sm">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left py-2">쿠키 이름</th>
                        <th className="text-left py-2">목적</th>
                        <th className="text-left py-2">만료</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">_ga</td>
                        <td className="py-2">Google Analytics 사용자 구분</td>
                        <td className="py-2">2년</td>
                      </tr>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">_ga_*</td>
                        <td className="py-2">Google Analytics 세션 데이터</td>
                        <td className="py-2">2년</td>
                      </tr>
                      <tr>
                        <td className="py-2">analytics_session_id</td>
                        <td className="py-2">내부 분석 세션 추적</td>
                        <td className="py-2">세션</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-dark-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-purple-400">마케팅 쿠키</h3>
                  <p className="text-dark-300 text-sm mb-2">
                    관련성 있는 광고를 표시하고 마케팅 효과를 측정합니다.
                  </p>
                  <table className="w-full text-dark-300 text-sm">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left py-2">쿠키 이름</th>
                        <th className="text-left py-2">목적</th>
                        <th className="text-left py-2">만료</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-dark-600/50">
                        <td className="py-2">_fbp</td>
                        <td className="py-2">Facebook 픽셀</td>
                        <td className="py-2">3개월</td>
                      </tr>
                      <tr>
                        <td className="py-2">stripe_mid</td>
                        <td className="py-2">Stripe 결제 추적</td>
                        <td className="py-2">1년</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">쿠키 관리 방법</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                대부분의 웹 브라우저에서 쿠키를 관리할 수 있습니다.
                아래에서 각 브라우저의 쿠키 설정 방법을 확인하세요:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/ko/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/ko-kr/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/ko-kr/microsoft-edge/microsoft-edge%EC%97%90%EC%84%9C-%EC%BF%A0%ED%82%A4-%EC%82%AD%EC%A0%9C-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    Edge
                  </a>
                </li>
              </ul>
              <p className="text-dark-400 text-sm mt-4">
                참고: 쿠키를 비활성화하면 서비스의 일부 기능이 제한될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">쿠키 설정 변경</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                아래 버튼을 클릭하여 쿠키 설정을 변경할 수 있습니다:
              </p>
              <button
                onClick={() => {
                  // Clear cookie consent to show banner again
                  document.cookie = 'cookie-consent=; Max-Age=0; path=/';
                  window.location.reload();
                }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                쿠키 설정 다시 선택하기
              </button>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제3자 쿠키</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회사는 서비스 제공 및 개선을 위해 제3자의 쿠키를 사용할 수 있습니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> 웹사이트 트래픽 분석{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <strong>Stripe:</strong> 결제 처리{' '}
                  <a
                    href="https://stripe.com/kr/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <strong>Vercel:</strong> 웹 호스팅{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Do Not Track</h2>
              <p className="text-dark-300 leading-relaxed">
                일부 브라우저에는 &quot;Do Not Track&quot;(DNT) 기능이 있습니다.
                현재 회사는 DNT 신호에 대한 표준화된 대응 방식이 없어,
                DNT 신호를 별도로 처리하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">문의</h2>
              <p className="text-dark-300 leading-relaxed">
                쿠키 정책에 대한 문의사항이 있으시면 아래 연락처로 문의해 주세요:
              </p>
              <ul className="list-disc list-inside text-dark-300 mt-2">
                <li>이메일: {contactEmail}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">정책 변경</h2>
              <p className="text-dark-300 leading-relaxed">
                회사는 쿠키 사용 방식의 변경에 따라 이 정책을 업데이트할 수 있습니다.
                중요한 변경 사항이 있을 경우 서비스 내 공지를 통해 알려드립니다.
              </p>
            </section>

            <section className="pt-6 border-t border-dark-700">
              <p className="text-dark-400 text-sm">
                이 쿠키 정책은 {lastUpdated}부터 적용됩니다.
              </p>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-dark-700 flex flex-wrap gap-4">
            <Link href="/terms" className="text-primary-400 hover:underline">
              이용약관
            </Link>
            <Link href="/privacy" className="text-primary-400 hover:underline">
              개인정보처리방침
            </Link>
            <Link href="/" className="text-primary-400 hover:underline">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
