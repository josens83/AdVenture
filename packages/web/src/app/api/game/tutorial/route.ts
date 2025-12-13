import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  getTutorialSteps,
  getNextStep,
  isTutorialComplete,
  getTutorialProgress,
} from '@adventure/shared';

// Get tutorial progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tutorialType = searchParams.get('type') || 'intro';

    // Get or create tutorial progress
    let tutorialProgress = await prisma.tutorialProgress.findUnique({
      where: { userId: session.user.id },
    });

    if (!tutorialProgress) {
      tutorialProgress = await prisma.tutorialProgress.create({
        data: {
          userId: session.user.id,
          tutorialType: 'intro',
          completedSteps: [],
        },
      });
    }

    // Get tutorial steps
    const steps = getTutorialSteps(tutorialType);
    const nextStep = getNextStep(tutorialType, tutorialProgress.completedSteps);
    const isComplete = isTutorialComplete(tutorialType, tutorialProgress.completedSteps);
    const progress = getTutorialProgress(tutorialType, tutorialProgress.completedSteps);

    return NextResponse.json({
      tutorialType: tutorialProgress.tutorialType,
      completedSteps: tutorialProgress.completedSteps,
      currentStep: tutorialProgress.currentStep,
      isCompleted: tutorialProgress.isCompleted,
      neverShowAgain: tutorialProgress.neverShowAgain,
      steps: steps.map((step) => ({
        id: step.id,
        title: step.title,
        titleKo: step.titleKo,
        description: step.description,
        descriptionKo: step.descriptionKo,
        target: step.target,
        position: step.position,
        action: step.action,
        reward: step.reward,
        isCompleted: tutorialProgress!.completedSteps.includes(step.id),
      })),
      nextStep: nextStep
        ? {
            id: nextStep.id,
            title: nextStep.title,
            titleKo: nextStep.titleKo,
            description: nextStep.description,
            descriptionKo: nextStep.descriptionKo,
            target: nextStep.target,
            position: nextStep.position,
            action: nextStep.action,
          }
        : null,
      progress,
      isComplete,
    });
  } catch (error) {
    console.error('Get tutorial error:', error);
    return NextResponse.json(
      { error: 'Failed to get tutorial progress' },
      { status: 500 }
    );
  }
}

// Complete a tutorial step
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stepId, action } = await request.json();

    // Get current progress
    let tutorialProgress = await prisma.tutorialProgress.findUnique({
      where: { userId: session.user.id },
    });

    if (!tutorialProgress) {
      tutorialProgress = await prisma.tutorialProgress.create({
        data: {
          userId: session.user.id,
          tutorialType: 'intro',
          completedSteps: [],
        },
      });
    }

    // Handle different actions
    if (action === 'skip') {
      // Skip tutorial
      await prisma.tutorialProgress.update({
        where: { userId: session.user.id },
        data: {
          skippedAt: new Date(),
          isCompleted: true,
        },
      });

      return NextResponse.json({ success: true, skipped: true });
    }

    if (action === 'never_show') {
      // Never show again
      await prisma.tutorialProgress.update({
        where: { userId: session.user.id },
        data: {
          neverShowAgain: true,
          skippedAt: new Date(),
          isCompleted: true,
        },
      });

      return NextResponse.json({ success: true, neverShowAgain: true });
    }

    if (action === 'start_new' && stepId) {
      // Start a new tutorial type
      await prisma.tutorialProgress.update({
        where: { userId: session.user.id },
        data: {
          tutorialType: stepId,
          completedSteps: [],
          currentStep: null,
          isCompleted: false,
        },
      });

      return NextResponse.json({ success: true, started: stepId });
    }

    // Complete a step
    if (!stepId) {
      return NextResponse.json(
        { error: 'Step ID is required' },
        { status: 400 }
      );
    }

    // Validate step exists
    const steps = getTutorialSteps(tutorialProgress.tutorialType);
    const step = steps.find((s) => s.id === stepId);

    if (!step) {
      return NextResponse.json(
        { error: 'Invalid step ID' },
        { status: 400 }
      );
    }

    // Check if already completed
    if (tutorialProgress.completedSteps.includes(stepId)) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
      });
    }

    // Add step to completed steps
    const newCompletedSteps = [...tutorialProgress.completedSteps, stepId];
    const nextStep = getNextStep(tutorialProgress.tutorialType, newCompletedSteps);
    const isComplete = isTutorialComplete(tutorialProgress.tutorialType, newCompletedSteps);

    // Apply rewards if any
    let rewardsApplied = null;
    if (step.reward) {
      // Get latest save
      const latestSave = await prisma.gameSave.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
      });

      if (latestSave) {
        const updates: Record<string, unknown> = {};

        if (step.reward.money) {
          updates.playerMoney = BigInt(latestSave.playerMoney) + BigInt(step.reward.money);
        }
        if (step.reward.experience) {
          updates.playerExperience = latestSave.playerExperience + step.reward.experience;
        }
        if (step.reward.reputation) {
          updates.playerReputation = Math.min(100, latestSave.playerReputation + step.reward.reputation);
        }

        if (Object.keys(updates).length > 0) {
          await prisma.gameSave.update({
            where: { id: latestSave.id },
            data: updates,
          });
          rewardsApplied = step.reward;
        }
      }
    }

    // Update progress
    await prisma.tutorialProgress.update({
      where: { userId: session.user.id },
      data: {
        completedSteps: newCompletedSteps,
        currentStep: nextStep?.id || null,
        isCompleted: isComplete,
        completedAt: isComplete ? new Date() : null,
      },
    });

    // Log analytics
    await prisma.userAnalytics.create({
      data: {
        userId: session.user.id,
        eventType: isComplete ? 'tutorial_completed' : 'tutorial_step_completed',
        eventData: {
          stepId,
          tutorialType: tutorialProgress.tutorialType,
          rewardsApplied,
        },
      },
    });

    return NextResponse.json({
      success: true,
      stepCompleted: stepId,
      nextStep: nextStep
        ? {
            id: nextStep.id,
            title: nextStep.title,
            titleKo: nextStep.titleKo,
            description: nextStep.description,
            descriptionKo: nextStep.descriptionKo,
            target: nextStep.target,
            position: nextStep.position,
            action: nextStep.action,
          }
        : null,
      isComplete,
      rewardsApplied,
      progress: getTutorialProgress(tutorialProgress.tutorialType, newCompletedSteps),
    });
  } catch (error) {
    console.error('Complete tutorial step error:', error);
    return NextResponse.json(
      { error: 'Failed to complete tutorial step' },
      { status: 500 }
    );
  }
}
