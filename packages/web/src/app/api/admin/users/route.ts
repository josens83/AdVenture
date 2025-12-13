import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const subscription = searchParams.get('subscription');
    const role = searchParams.get('role');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subscription) {
      where.subscription = subscription;
    }

    if (role) {
      where.role = role;
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        subscription: true,
        subscriptionEnd: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            gameSaves: true,
            achievements: true,
            payments: true,
          },
        },
      },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        ...u,
        gameSaves: u._count.gameSaves,
        achievements: u._count.achievements,
        payments: u._count.payments,
        _count: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
      }
    }
    return NextResponse.json({ error: '사용자 목록 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminRole = await requireAdmin();

    const { userId, role, subscription } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: '사용자 ID가 필요합니다.' }, { status: 400 });
    }

    // Only ADMIN can change roles
    if (role && adminRole !== 'ADMIN') {
      return NextResponse.json({ error: '역할 변경 권한이 없습니다.' }, { status: 403 });
    }

    const updateData: any = {};

    if (role) {
      updateData.role = role;
    }

    if (subscription) {
      updateData.subscription = subscription;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscription: true,
      },
    });

    // Log admin action
    await prisma.gameAnalytics.create({
      data: {
        sessionId: `admin_action_${Date.now()}`,
        eventType: 'admin_user_updated',
        eventData: {
          targetUserId: userId,
          changes: updateData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
      }
    }
    return NextResponse.json({ error: '사용자 업데이트에 실패했습니다.' }, { status: 500 });
  }
}
