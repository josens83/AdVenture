'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  const lastUpdated = '2024년 1월 15일';
  const companyName = '마케터 생존기';
  const contactEmail = 'support@marketer-survival.com';

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
            <h1 className="text-3xl font-bold mt-4">이용약관</h1>
            <p className="text-dark-400 mt-2">최종 수정일: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
              <p className="text-dark-300 leading-relaxed">
                이 약관은 {companyName}(이하 &quot;회사&quot;)가 제공하는 마케팅 시뮬레이션 게임 서비스(이하 &quot;서비스&quot;)의
                이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>&quot;서비스&quot;란 회사가 제공하는 온라인 마케팅 시뮬레이션 게임 및 관련 서비스를 말합니다.</li>
                <li>&quot;회원&quot;이란 회사와 서비스 이용계약을 체결하고 회원 아이디를 부여받은 자를 말합니다.</li>
                <li>&quot;아이디(ID)&quot;란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 말합니다.</li>
                <li>&quot;비밀번호&quot;란 회원의 개인정보 보호를 위해 회원 자신이 설정한 문자와 숫자의 조합을 말합니다.</li>
                <li>&quot;유료 서비스&quot;란 회사가 유료로 제공하는 프리미엄 구독 서비스를 말합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
                <li>회사는 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있습니다.</li>
                <li>변경된 약관은 공지사항을 통해 공지되며, 공지 후 7일 이내에 거부 의사를 표명하지 않으면 동의한 것으로 간주합니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제4조 (이용 계약의 체결)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>이용 계약은 회원이 되고자 하는 자가 약관의 내용에 동의한 후 회원가입을 신청하고, 회사가 이를 승낙함으로써 체결됩니다.</li>
                <li>회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 거부할 수 있습니다:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>허위 정보를 기재하거나 필수 기재 사항을 누락한 경우</li>
                    <li>이전에 회원 자격을 상실한 적이 있는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제5조 (서비스의 제공)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>회사는 회원에게 다음과 같은 서비스를 제공합니다:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>마케팅 시뮬레이션 게임</li>
                    <li>게임 진행 저장 및 불러오기</li>
                    <li>리더보드 및 업적 시스템</li>
                    <li>프리미엄 구독 서비스</li>
                  </ul>
                </li>
                <li>서비스는 연중무휴 24시간 제공을 원칙으로 합니다. 다만, 정기 점검 등의 사유로 서비스가 일시 중단될 수 있습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제6조 (유료 서비스)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>유료 서비스의 이용 요금 및 결제 방법은 서비스 내에 별도로 게시됩니다.</li>
                <li>유료 서비스는 월간 또는 연간 구독 형태로 제공됩니다.</li>
                <li>구독은 취소하지 않는 한 자동으로 갱신됩니다.</li>
                <li>환불 정책:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>구독 시작 후 7일 이내에 서비스를 전혀 이용하지 않은 경우 전액 환불 가능</li>
                    <li>7일 이후에는 월할 계산하여 잔여 기간에 대한 환불 가능</li>
                    <li>프로모션 또는 할인 적용 구매의 경우 환불 조건이 다를 수 있습니다</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제7조 (회원의 의무)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>회원은 다음 행위를 하여서는 안 됩니다:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 무단 변경</li>
                    <li>회사가 허용하지 않은 방법으로 서비스를 이용하는 행위</li>
                    <li>불법 프로그램이나 버그를 이용한 부정행위</li>
                    <li>회사의 서비스를 방해하거나 시스템에 위협을 가하는 행위</li>
                  </ul>
                </li>
                <li>회원은 자신의 아이디와 비밀번호를 안전하게 관리해야 하며, 관리 소홀로 인한 손해는 회원이 책임집니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제8조 (서비스 이용 제한)</h2>
              <p className="text-dark-300 leading-relaxed">
                회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우,
                서비스 이용을 경고, 일시정지, 영구정지 등으로 제한할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제9조 (개인정보 보호)</h2>
              <p className="text-dark-300 leading-relaxed">
                회사는 회원의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를 준수합니다.
                자세한 내용은 <Link href="/privacy" className="text-primary-400 hover:underline">개인정보처리방침</Link>을 참조하시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제10조 (지적재산권)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>서비스에 포함된 모든 콘텐츠(텍스트, 그래픽, 로고, 아이콘, 이미지, 오디오 클립, 디지털 다운로드 등)는 회사의 재산입니다.</li>
                <li>회원은 회사의 사전 서면 동의 없이 서비스의 어떤 부분도 복제, 배포, 전송, 수정할 수 없습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제11조 (면책조항)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대해 책임을 지지 않습니다.</li>
                <li>회사는 회원이 서비스를 통해 기대하는 수익을 얻지 못하거나 상실한 것에 대해 책임을 지지 않습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제12조 (분쟁 해결)</h2>
              <ol className="list-decimal list-inside text-dark-300 space-y-2">
                <li>회사와 회원 간에 발생한 분쟁에 대해서는 회사의 본점 소재지를 관할하는 법원을 전속 관할법원으로 합니다.</li>
                <li>회사와 회원 간의 서비스 이용에 관한 분쟁에 대해서는 대한민국 법을 적용합니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">제13조 (연락처)</h2>
              <p className="text-dark-300 leading-relaxed">
                서비스 이용에 관한 문의사항은 다음 연락처로 문의하시기 바랍니다:
              </p>
              <ul className="list-disc list-inside text-dark-300 mt-2">
                <li>이메일: {contactEmail}</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-dark-700">
              <p className="text-dark-400 text-sm">
                부칙: 이 약관은 {lastUpdated}부터 시행됩니다.
              </p>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-dark-700 flex flex-wrap gap-4">
            <Link href="/privacy" className="text-primary-400 hover:underline">
              개인정보처리방침
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
