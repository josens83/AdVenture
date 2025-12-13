import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    // Validate inputs
    if (!token) {
      return NextResponse.json(
        { error: '재설정 토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: '비밀번호는 최소 8자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: '유효하지 않은 재설정 링크입니다.' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > resetToken.expires) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        { error: '재설정 링크가 만료되었습니다. 다시 요청해주세요.' },
        { status: 400 }
      );
    }

    // Check if token is already used
    if (resetToken.used) {
      return NextResponse.json(
        { error: '이미 사용된 재설정 링크입니다.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    // Invalidate all sessions for this user (optional but recommended)
    await prisma.session.deleteMany({
      where: { userId: resetToken.userId },
    });

    return NextResponse.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: '비밀번호 재설정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET endpoint to validate token before showing reset form
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: '토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: '유효하지 않은 토큰입니다.' },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expires) {
      return NextResponse.json(
        { valid: false, error: '토큰이 만료되었습니다.' },
        { status: 400 }
      );
    }

    if (resetToken.used) {
      return NextResponse.json(
        { valid: false, error: '이미 사용된 토큰입니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { valid: false, error: '검증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
