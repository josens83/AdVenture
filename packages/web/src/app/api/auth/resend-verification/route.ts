import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail, generateToken } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { email } = body;

    // Get email from session or request body
    const targetEmail = session?.user?.email || email;

    if (!targetEmail) {
      return NextResponse.json(
        { error: '이메일 주소가 필요합니다.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message: '인증 이메일이 발송되었습니다.',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: '이미 인증된 이메일입니다.' },
        { status: 400 }
      );
    }

    // Check rate limit - only allow resend every 60 seconds
    const recentToken = await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000), // 60 seconds
        },
      },
    });

    if (recentToken) {
      return NextResponse.json(
        { error: '인증 이메일은 1분에 한 번만 요청할 수 있습니다.' },
        { status: 429 }
      );
    }

    // Delete old tokens
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new token
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token
    await prisma.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        email: user.email,
        expires,
      },
    });

    // Send email
    const sent = await sendVerificationEmail(user.email, token, user.name || undefined);

    if (!sent) {
      return NextResponse.json(
        { error: '이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '인증 이메일이 발송되었습니다.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
