import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail, generateToken } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: '이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: '이메일이 등록되어 있다면 비밀번호 재설정 링크가 발송됩니다.',
      });
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.hashedPassword) {
      // User signed up with OAuth, can't reset password
      return NextResponse.json({
        success: true,
        message: '이메일이 등록되어 있다면 비밀번호 재설정 링크가 발송됩니다.',
      });
    }

    // Check rate limit - only allow reset request every 5 minutes
    const recentToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes
        },
      },
    });

    if (recentToken) {
      return NextResponse.json(
        { error: '비밀번호 재설정 요청은 5분에 한 번만 가능합니다.' },
        { status: 429 }
      );
    }

    // Delete old unused tokens
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        used: false,
      },
    });

    // Generate new token
    const token = generateToken(48);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    });

    // Send email
    const sent = await sendPasswordResetEmail(user.email, token, user.name || undefined);

    if (!sent) {
      // Log error but don't reveal to user
      console.error('Failed to send password reset email to:', email);
    }

    return NextResponse.json({
      success: true,
      message: '이메일이 등록되어 있다면 비밀번호 재설정 링크가 발송됩니다.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
