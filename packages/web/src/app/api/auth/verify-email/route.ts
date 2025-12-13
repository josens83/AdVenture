import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: '유효하지 않은 인증 토큰입니다.' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });

      return NextResponse.json(
        { error: '인증 토큰이 만료되었습니다. 다시 요청해주세요.' },
        { status: 400 }
      );
    }

    // Update user's email verification status
    const user = await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the used token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Delete any other verification tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: verificationToken.userId },
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name || undefined);

    return NextResponse.json({
      success: true,
      message: '이메일이 성공적으로 인증되었습니다.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: '이메일 인증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
