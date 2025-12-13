import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  getSkillById,
  getAvailableSkills,
  SKILL_EXP_PER_LEVEL,
  calculateSkillEffects,
} from '@adventure/shared';

// Get user's skills
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current skills
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: session.user.id },
    });

    // Get user's level from latest save
    const latestSave = await prisma.gameSave.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: { playerLevel: true },
    });

    const playerLevel = latestSave?.playerLevel || 1;

    // Get available skills for this player
    const learnedSkillIds = userSkills.map((s) => s.skillId);
    const availableSkills = getAvailableSkills(playerLevel, learnedSkillIds);

    // Calculate total effects
    const skillsForCalc = userSkills.map((s) => ({
      skillId: s.skillId,
      level: s.level,
    }));
    const effects = calculateSkillEffects(skillsForCalc);

    // Convert effects Map to object for JSON
    const effectsObj: Record<string, { total: number; byChannel: Record<string, number> }> = {};
    effects.forEach((value, key) => {
      effectsObj[key] = {
        total: value.total,
        byChannel: Object.fromEntries(value.byChannel),
      };
    });

    return NextResponse.json({
      skills: userSkills.map((skill) => ({
        id: skill.skillId,
        level: skill.level,
        experience: skill.experience,
        nextLevelExp: SKILL_EXP_PER_LEVEL[skill.level + 1] || null,
      })),
      availableSkills: availableSkills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        nameKo: skill.nameKo,
        description: skill.description,
        descriptionKo: skill.descriptionKo,
        icon: skill.icon,
        category: skill.category,
        maxLevel: skill.maxLevel,
        unlockLevel: skill.unlockLevel,
        prerequisiteSkills: skill.prerequisiteSkills,
        isLearned: learnedSkillIds.includes(skill.id),
      })),
      effects: effectsObj,
      playerLevel,
    });
  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json(
      { error: 'Failed to get skills' },
      { status: 500 }
    );
  }
}

// Learn or upgrade a skill
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillId, experienceToAdd } = await request.json();

    if (!skillId) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Validate skill exists
    const skill = getSkillById(skillId);
    if (!skill) {
      return NextResponse.json(
        { error: 'Invalid skill ID' },
        { status: 400 }
      );
    }

    // Get user's current skills
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: session.user.id },
    });

    // Get user's level
    const latestSave = await prisma.gameSave.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: { playerLevel: true },
    });

    const playerLevel = latestSave?.playerLevel || 1;

    // Check if player level is sufficient
    if (skill.unlockLevel > playerLevel) {
      return NextResponse.json(
        { error: `Level ${skill.unlockLevel} required to learn this skill` },
        { status: 403 }
      );
    }

    // Check prerequisites
    if (skill.prerequisiteSkills) {
      const learnedSkillIds = userSkills.map((s) => s.skillId);
      const hasAllPrereqs = skill.prerequisiteSkills.every((prereq) =>
        learnedSkillIds.includes(prereq)
      );
      if (!hasAllPrereqs) {
        return NextResponse.json(
          { error: 'Prerequisite skills not met' },
          { status: 403 }
        );
      }
    }

    // Find existing skill or create new
    const existingSkill = userSkills.find((s) => s.skillId === skillId);

    if (existingSkill) {
      // Add experience and check for level up
      let newExperience = existingSkill.experience + (experienceToAdd || 0);
      let newLevel = existingSkill.level;

      // Check for level up
      while (
        newLevel < skill.maxLevel &&
        newExperience >= SKILL_EXP_PER_LEVEL[newLevel + 1]
      ) {
        newExperience -= SKILL_EXP_PER_LEVEL[newLevel + 1];
        newLevel++;
      }

      // Cap experience if at max level
      if (newLevel >= skill.maxLevel) {
        newExperience = 0;
      }

      const updatedSkill = await prisma.userSkill.update({
        where: { id: existingSkill.id },
        data: {
          level: newLevel,
          experience: newExperience,
        },
      });

      return NextResponse.json({
        success: true,
        skill: {
          id: updatedSkill.skillId,
          level: updatedSkill.level,
          experience: updatedSkill.experience,
          nextLevelExp: SKILL_EXP_PER_LEVEL[updatedSkill.level + 1] || null,
        },
        leveledUp: newLevel > existingSkill.level,
      });
    } else {
      // Create new skill
      const newSkill = await prisma.userSkill.create({
        data: {
          userId: session.user.id,
          skillId,
          level: 1,
          experience: experienceToAdd || 0,
        },
      });

      // Log analytics
      await prisma.userAnalytics.create({
        data: {
          userId: session.user.id,
          eventType: 'skill_learned',
          eventData: { skillId },
        },
      });

      return NextResponse.json({
        success: true,
        skill: {
          id: newSkill.skillId,
          level: newSkill.level,
          experience: newSkill.experience,
          nextLevelExp: SKILL_EXP_PER_LEVEL[2],
        },
        isNew: true,
      });
    }
  } catch (error) {
    console.error('Learn skill error:', error);
    return NextResponse.json(
      { error: 'Failed to learn skill' },
      { status: 500 }
    );
  }
}
