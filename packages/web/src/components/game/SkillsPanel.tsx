'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILL_CATEGORIES, SKILLS, Skill, SkillCategory } from '@adventure/shared';

interface UserSkill {
  id: string;
  level: number;
  experience: number;
  nextLevelExp: number | null;
}

interface AvailableSkill {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  icon: string;
  category: SkillCategory;
  maxLevel: number;
  unlockLevel: number;
  prerequisiteSkills?: string[];
  isLearned: boolean;
}

interface SkillsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  playerLevel: number;
}

export default function SkillsPanel({
  isOpen,
  onClose,
  playerLevel,
}: SkillsPanelProps) {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<AvailableSkill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [learning, setLearning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSkills();
    }
  }, [isOpen]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/game/skills');
      if (response.ok) {
        const data = await response.json();
        setUserSkills(data.skills);
        setAvailableSkills(data.availableSkills);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const learnSkill = async (skillId: string) => {
    try {
      setLearning(true);
      const response = await fetch('/api/game/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchSkills();
          setSelectedSkill(null);
        }
      }
    } catch (error) {
      console.error('Failed to learn skill:', error);
    } finally {
      setLearning(false);
    }
  };

  const filteredSkills = selectedCategory === 'all'
    ? availableSkills
    : availableSkills.filter((s) => s.category === selectedCategory);

  const getUserSkill = (skillId: string) => {
    return userSkills.find((s) => s.id === skillId);
  };

  const getSkillDetails = (skillId: string) => {
    return SKILLS.find((s) => s.id === skillId);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-800 border border-dark-600 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-700 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">스킬 트리</h2>
              <p className="text-dark-400">
                현재 레벨: {playerLevel} | 습득한 스킬: {userSkills.length}개
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-dark-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Categories */}
          <div className="p-4 border-b border-dark-700 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                }`}
              >
                전체
              </button>
              {SKILL_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.nameKo}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill) => {
                  const userSkill = getUserSkill(skill.id);
                  const skillDetails = getSkillDetails(skill.id);
                  const isLocked = skill.unlockLevel > playerLevel;
                  const hasPrereqMissing = skill.prerequisiteSkills?.some(
                    (prereq) => !userSkills.find((s) => s.id === prereq)
                  );

                  return (
                    <motion.div
                      key={skill.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => !isLocked && !hasPrereqMissing && setSelectedSkill(skillDetails || null)}
                      className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                        isLocked || hasPrereqMissing
                          ? 'bg-dark-800/50 border-dark-700 opacity-50 cursor-not-allowed'
                          : userSkill
                          ? 'bg-primary-900/20 border-primary-500/30 hover:border-primary-500'
                          : 'bg-dark-700/50 border-dark-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{skill.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{skill.nameKo}</h3>
                            {userSkill && (
                              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
                                Lv.{userSkill.level}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-dark-400 mt-1">
                            {skill.descriptionKo}
                          </p>

                          {/* Progress bar for learned skills */}
                          {userSkill && userSkill.nextLevelExp && (
                            <div className="mt-2">
                              <div className="h-1 bg-dark-600 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-500 rounded-full"
                                  style={{
                                    width: `${(userSkill.experience / userSkill.nextLevelExp) * 100}%`,
                                  }}
                                />
                              </div>
                              <p className="text-xs text-dark-500 mt-1">
                                {userSkill.experience} / {userSkill.nextLevelExp} XP
                              </p>
                            </div>
                          )}

                          {/* Lock info */}
                          {isLocked && (
                            <p className="text-xs text-red-400 mt-2">
                              레벨 {skill.unlockLevel} 필요
                            </p>
                          )}
                          {hasPrereqMissing && !isLocked && (
                            <p className="text-xs text-yellow-400 mt-2">
                              선행 스킬 필요
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Skill Detail Modal */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
                onClick={() => setSelectedSkill(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-dark-800 border border-dark-600 rounded-xl p-6 max-w-md w-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{selectedSkill.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedSkill.nameKo}</h3>
                      <p className="text-dark-400">{selectedSkill.name}</p>
                    </div>
                  </div>

                  <p className="text-dark-300 mb-4">
                    {selectedSkill.descriptionKo}
                  </p>

                  {/* Effects */}
                  <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium mb-2">효과 (레벨당)</h4>
                    <ul className="space-y-1">
                      {selectedSkill.effects.map((effect, idx) => (
                        <li key={idx} className="text-sm text-dark-300">
                          • {effect.type.replace(/_/g, ' ')}: +{(effect.value * 100).toFixed(0)}%
                          {effect.channel && ` (${effect.channel})`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prerequisites */}
                  {selectedSkill.prerequisiteSkills && selectedSkill.prerequisiteSkills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-sm">선행 스킬</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkill.prerequisiteSkills.map((prereq) => {
                          const prereqSkill = SKILLS.find((s) => s.id === prereq);
                          const isLearned = userSkills.find((s) => s.id === prereq);
                          return (
                            <span
                              key={prereq}
                              className={`text-xs px-2 py-1 rounded ${
                                isLearned
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {prereqSkill?.nameKo || prereq}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {getUserSkill(selectedSkill.id) ? (
                      <div className="flex-1 text-center py-2 text-green-400">
                        이미 습득한 스킬입니다
                      </div>
                    ) : (
                      <button
                        onClick={() => learnSkill(selectedSkill.id)}
                        disabled={learning}
                        className="btn-primary flex-1"
                      >
                        {learning ? '습득 중...' : '스킬 습득'}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedSkill(null)}
                      className="btn-secondary px-4"
                    >
                      닫기
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
