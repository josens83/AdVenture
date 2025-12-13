import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail, generateToken } from '@/lib/email';
import { authRateLimiter } from '@/lib/rate-limit';
import {
  isValidEmail,
  validatePasswordStrength,
  isCommonPassword,
  sanitizeInput,
} from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await authRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const email = sanitizeInput(body.email || '');
    const password = body.password || '';
    const name = sanitizeInput(body.name || '');

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Check email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    // Check for common passwords
    if (isCommonPassword(password)) {
      return NextResponse.json(
        { error: '너무 흔한 비밀번호입니다. 다른 비밀번호를 사용해주세요.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || email.split('@')[0],
        hashedPassword,
      },
    });

    // Create initial leaderboard entry
    await prisma.leaderboardEntry.create({
      data: {
        userId: user.id,
      },
    });

    // Generate verification token
    const verificationToken = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save verification token
    await prisma.emailVerificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        email: normalizedEmail,
        expires,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(
      normalizedEmail,
      verificationToken,
      user.name || undefined
    );

    // Log analytics event
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: 'user_registered',
        eventData: {
          provider: 'credentials',
          emailSent,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다. 이메일을 확인하여 계정을 인증해주세요.',
      requiresVerification: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
