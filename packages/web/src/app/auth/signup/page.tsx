'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Validation
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    const allValid = Object.values(passwordStrength).every(Boolean);
    if (!allValid) {
      setErrorMessage('비밀번호 요구사항을 모두 충족해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // Register
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || '회원가입에 실패했습니다.');
        return;
      }

      // Show verification message instead of auto-login
      if (data.requiresVerification) {
        setShowVerificationMessage(true);
      }
    } catch (error) {
      setErrorMessage('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-xs ${met ? 'text-green-400' : 'text-dark-500'}`}>
      {met ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      )}
      <span>{text}</span>
    </div>
  );

  // Show verification success message
  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">이메일을 확인해주세요!</h1>
            <p className="text-dark-300 mb-6">
              <span className="text-primary-400 font-medium">{email}</span>으로<br />
              인증 이메일을 발송했습니다.
            </p>
            <p className="text-dark-400 text-sm mb-8">
              이메일의 인증 링크를 클릭하여 회원가입을 완료해주세요.<br />
              이메일이 오지 않았다면 스팸함을 확인해주세요.
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="btn-primary w-full block text-center"
              >
                로그인 페이지로 이동
              </Link>
              <button
                onClick={() => {
                  setShowVerificationMessage(false);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-dark-400 hover:text-dark-300 text-sm"
              >
                다른 이메일로 가입하기
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-5xl">📊</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            회원가입
          </h1>
          <p className="text-dark-400 mt-2">마케터 생존기를 시작하세요</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthSignIn('google')}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 시작하기
          </button>

          <button
            onClick={() => handleOAuthSignIn('github')}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub로 시작하기
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-dark-400 text-sm">또는</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              이름 (닉네임)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="마케터"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="비밀번호"
              required
            />
            <div className="mt-2 grid grid-cols-2 gap-1">
              <PasswordRequirement met={passwordStrength.length} text="8자 이상" />
              <PasswordRequirement met={passwordStrength.uppercase} text="대문자 포함" />
              <PasswordRequirement met={passwordStrength.lowercase} text="소문자 포함" />
              <PasswordRequirement met={passwordStrength.number} text="숫자 포함" />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              placeholder="비밀번호 다시 입력"
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-dark-500 text-center mt-4">
          가입하면{' '}
          <Link href="/terms" className="text-primary-400 hover:underline">
            이용약관
          </Link>
          과{' '}
          <Link href="/privacy" className="text-primary-400 hover:underline">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-dark-400">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/auth/signin"
            className="text-primary-400 hover:underline"
          >
            로그인
          </Link>
        </p>

        {/* Back to Game */}
        <div className="text-center mt-4">
          <Link href="/" className="text-dark-500 hover:text-dark-300 text-sm">
            ← 게임으로 돌아가기
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
