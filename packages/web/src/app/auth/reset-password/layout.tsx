import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '비밀번호 재설정 | 마케터 생존기',
  description: '새 비밀번호를 설정하세요.',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
