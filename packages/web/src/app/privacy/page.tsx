'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-bold mt-4">개인정보처리방침</h1>
            <p className="text-dark-400 mt-2">최종 수정일: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. 개인정보 수집 항목</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                {companyName}(이하 &quot;회사&quot;)는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
              </p>

              <h3 className="text-lg font-medium mt-4 mb-2">필수 수집 항목</h3>
              <ul className="list-disc list-inside text-dark-300 space-y-1">
                <li>이메일 주소</li>
                <li>비밀번호 (암호화하여 저장)</li>
                <li>닉네임/이름</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2">선택 수집 항목</h3>
              <ul className="list-disc list-inside text-dark-300 space-y-1">
                <li>프로필 이미지</li>
                <li>소셜 로그인 정보 (Google, GitHub 등)</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2">자동 수집 항목</h3>
              <ul className="list-disc list-inside text-dark-300 space-y-1">
                <li>IP 주소</li>
                <li>브라우저 종류 및 버전</li>
                <li>기기 정보</li>
                <li>방문 일시</li>
                <li>서비스 이용 기록</li>
                <li>쿠키</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. 개인정보 수집 방법</h2>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>회원가입 시 직접 입력</li>
                <li>소셜 로그인을 통한 제공</li>
                <li>서비스 이용 과정에서 자동 수집</li>
                <li>고객 문의를 통한 수집</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. 개인정보의 이용 목적</h2>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>회원 식별 및 서비스 제공</li>
                <li>게임 진행 상황 저장 및 동기화</li>
                <li>구독 서비스 결제 및 관리</li>
                <li>고객 지원 및 문의 응대</li>
                <li>서비스 개선 및 신규 서비스 개발</li>
                <li>이벤트 및 마케팅 정보 제공 (동의한 경우)</li>
                <li>부정 이용 방지 및 서비스 안정성 확보</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. 개인정보의 보유 및 이용 기간</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회사는 회원 탈퇴 시 또는 개인정보 수집·이용 목적 달성 시까지 개인정보를 보유합니다.
                단, 관계 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                <li>접속에 관한 기록: 3개월</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. 개인정보의 제3자 제공</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회사는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>회원이 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. 개인정보 처리 위탁</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:
              </p>
              <div className="bg-dark-700/50 p-4 rounded-lg">
                <table className="w-full text-dark-300 text-sm">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-2">수탁업체</th>
                      <th className="text-left py-2">위탁 업무</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dark-600/50">
                      <td className="py-2">Stripe, Inc.</td>
                      <td className="py-2">결제 처리</td>
                    </tr>
                    <tr className="border-b border-dark-600/50">
                      <td className="py-2">Vercel Inc.</td>
                      <td className="py-2">웹 호스팅</td>
                    </tr>
                    <tr>
                      <td className="py-2">AWS (Amazon Web Services)</td>
                      <td className="py-2">데이터 저장 및 처리</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. 회원의 권리</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회원은 언제든지 다음의 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li><strong>열람권:</strong> 본인의 개인정보 처리 현황을 열람할 권리</li>
                <li><strong>정정권:</strong> 부정확한 개인정보의 정정을 요구할 권리</li>
                <li><strong>삭제권:</strong> 개인정보의 삭제를 요구할 권리</li>
                <li><strong>처리정지권:</strong> 개인정보 처리의 정지를 요구할 권리</li>
                <li><strong>이동권:</strong> 개인정보를 다른 서비스로 이동할 권리</li>
                <li><strong>동의철회권:</strong> 개인정보 처리에 대한 동의를 철회할 권리</li>
              </ul>
              <p className="text-dark-300 mt-4">
                권리 행사는 설정 페이지에서 직접 하거나, {contactEmail}로 문의하실 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. 개인정보 보호 조치</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회사는 개인정보를 안전하게 보호하기 위해 다음과 같은 조치를 취하고 있습니다:
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">기술적 조치</h3>
              <ul className="list-disc list-inside text-dark-300 space-y-1">
                <li>비밀번호 암호화 저장 (bcrypt)</li>
                <li>SSL/TLS를 통한 데이터 전송 암호화</li>
                <li>방화벽 및 침입탐지시스템 운영</li>
                <li>정기적인 보안 점검</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2">관리적 조치</h3>
              <ul className="list-disc list-inside text-dark-300 space-y-1">
                <li>개인정보 취급자 최소화</li>
                <li>개인정보 보호 교육 실시</li>
                <li>내부 관리계획 수립 및 시행</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. 쿠키의 사용</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회사는 서비스 제공을 위해 쿠키를 사용합니다. 쿠키에 대한 자세한 내용은{' '}
                <Link href="/cookies" className="text-primary-400 hover:underline">
                  쿠키 정책
                </Link>
                을 참조하시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. 아동의 개인정보</h2>
              <p className="text-dark-300 leading-relaxed">
                회사의 서비스는 만 14세 미만의 아동을 대상으로 하지 않습니다.
                만 14세 미만 아동의 개인정보가 수집된 것을 인지한 경우, 즉시 해당 정보를 삭제합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. 국외 이전</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                회사는 서비스 제공을 위해 개인정보를 해외에 저장하거나 처리할 수 있습니다.
                이 경우 적절한 보호 조치를 취하여 개인정보를 안전하게 보호합니다.
              </p>
              <div className="bg-dark-700/50 p-4 rounded-lg">
                <table className="w-full text-dark-300 text-sm">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-2">이전 국가</th>
                      <th className="text-left py-2">이전 항목</th>
                      <th className="text-left py-2">이전 일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dark-600/50">
                      <td className="py-2">미국</td>
                      <td className="py-2">서비스 이용 데이터</td>
                      <td className="py-2">서비스 이용 시</td>
                    </tr>
                    <tr>
                      <td className="py-2">유럽</td>
                      <td className="py-2">결제 정보</td>
                      <td className="py-2">결제 시</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">12. GDPR (유럽 거주자)</h2>
              <p className="text-dark-300 leading-relaxed mb-4">
                유럽연합(EU) 또는 유럽경제지역(EEA) 거주자인 경우, GDPR에 따른 추가 권리가 있습니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>개인정보 처리의 법적 근거에 대해 알 권리</li>
                <li>개인정보가 유럽 외부로 이전되는 경우 적절한 보호 조치에 대해 알 권리</li>
                <li>감독 기관에 민원을 제기할 권리</li>
              </ul>
              <p className="text-dark-300 mt-4">
                회사의 개인정보 처리 법적 근거는 다음과 같습니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-1 mt-2">
                <li>서비스 제공을 위한 계약 이행</li>
                <li>법적 의무 준수</li>
                <li>정당한 이익 (서비스 개선, 부정 방지)</li>
                <li>동의 (마케팅 등)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">13. 개인정보 보호책임자</h2>
              <p className="text-dark-300 leading-relaxed">
                개인정보 보호에 관한 문의사항은 아래 연락처로 문의하시기 바랍니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 mt-2">
                <li>담당자: 개인정보 보호책임자</li>
                <li>이메일: {contactEmail}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">14. 개인정보처리방침의 변경</h2>
              <p className="text-dark-300 leading-relaxed">
                이 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용이 변경될 수 있습니다.
                변경 시에는 최소 7일 전에 공지사항을 통해 알려드립니다.
              </p>
            </section>

            <section className="pt-6 border-t border-dark-700">
              <p className="text-dark-400 text-sm">
                이 개인정보처리방침은 {lastUpdated}부터 적용됩니다.
              </p>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-dark-700 flex flex-wrap gap-4">
            <Link href="/terms" className="text-primary-400 hover:underline">
              이용약관
            </Link>
            <Link href="/cookies" className="text-primary-400 hover:underline">
              쿠키 정책
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
