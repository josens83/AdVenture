import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // Validate new password
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: '새 비밀번호는 최소 8자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return NextResponse.json(
        { error: '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: '비밀번호를 변경할 수 없는 계정입니다.' },
        { status: 400 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '현재 비밀번호가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.hashedPassword);
    if (isSamePassword) {
      return NextResponse.json(
        { error: '새 비밀번호는 현재 비밀번호와 달라야 합니다.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    });

    // Invalidate other sessions (except current one)
    // Note: In a real app, you might want to keep track of the current session

    // Log analytics
    await prisma.userAnalytics.create({
      data: {
        userId: session.user.id,
        eventType: 'password_changed',
      },
    });

    return NextResponse.json({
      success: true,
      message: '비밀번호가 변경되었습니다.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: '비밀번호 변경에 실패했습니다.' },
      { status: 500 }
    );
  }
}
