'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMoney } from '@adventure/shared';

interface GameSave {
  id: string;
  slotNumber: number;
  playerName: string;
  playerLevel: number;
  playerMoney: string;
  playerReputation: number;
  completedProjects: number;
  gameState: string;
  currentDay: number;
  updatedAt: string;
}

interface SaveLoadScreenProps {
  isOpen: boolean;
  mode: 'save' | 'load';
  onClose: () => void;
  onSave?: (slotNumber: number) => Promise<void>;
  onLoad?: (slotNumber: number) => Promise<void>;
  maxSlots: number;
}

export default function SaveLoadScreen({
  isOpen,
  mode,
  onClose,
  onSave,
  onLoad,
  maxSlots,
}: SaveLoadScreenProps) {
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSaves();
    }
  }, [isOpen]);

  const fetchSaves = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/game/save');
      if (response.ok) {
        const data = await response.json();
        setSaves(data.saves);
      }
    } catch (error) {
      console.error('Failed to fetch saves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = async (slotNumber: number) => {
    const existingSave = saves.find((s) => s.slotNumber === slotNumber);

    if (mode === 'save') {
      if (existingSave && !confirm('기존 저장을 덮어쓰시겠습니까?')) {
        return;
      }
      setProcessing(slotNumber);
      try {
        await onSave?.(slotNumber);
        await fetchSaves();
      } finally {
        setProcessing(null);
      }
    } else if (mode === 'load' && existingSave) {
      setProcessing(slotNumber);
      try {
        await onLoad?.(slotNumber);
        onClose();
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleDelete = async (slotNumber: number) => {
    try {
      setProcessing(slotNumber);
      const response = await fetch(`/api/game/save?slot=${slotNumber}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchSaves();
      }
    } catch (error) {
      console.error('Failed to delete save:', error);
    } finally {
      setProcessing(null);
      setConfirmDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStateLabel = (state: string) => {
    const labels: Record<string, string> = {
      intro: '시작',
      clientSelect: '클라이언트 선택',
      strategy: '전략 수립',
      execution: '캠페인 실행',
      analysis: '분석 중',
      results: '결과 확인',
      growth: '성장',
      gameover: '게임 오버',
    };
    return labels[state] || state;
  };

  if (!isOpen) return null;

  // Calculate available slots based on subscription
  const allSlots = Array.from({ length: Math.min(maxSlots === -1 ? 10 : maxSlots, 10) }, (_, i) => i + 1);

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
          className="bg-dark-800 border border-dark-600 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-700 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === 'save' ? '게임 저장' : '게임 불러오기'}
              </h2>
              <p className="text-dark-400">
                {mode === 'save'
                  ? '저장할 슬롯을 선택하세요'
                  : '불러올 저장 데이터를 선택하세요'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-dark-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-3">
                {allSlots.map((slotNumber) => {
                  const save = saves.find((s) => s.slotNumber === slotNumber);
                  const isLocked = maxSlots !== -1 && slotNumber > maxSlots;
                  const isProcessing = processing === slotNumber;

                  return (
                    <motion.div
                      key={slotNumber}
                      whileHover={!isLocked ? { scale: 1.01 } : undefined}
                      className={`relative p-4 rounded-xl border transition-colors ${
                        isLocked
                          ? 'bg-dark-800/50 border-dark-700 opacity-50 cursor-not-allowed'
                          : save
                          ? 'bg-dark-700/50 border-dark-600 hover:border-primary-500 cursor-pointer'
                          : mode === 'save'
                          ? 'bg-dark-700/30 border-dark-600 border-dashed hover:border-primary-500 cursor-pointer'
                          : 'bg-dark-800/50 border-dark-700 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => !isLocked && !isProcessing && handleSlotClick(slotNumber)}
                    >
                      {isProcessing && (
                        <div className="absolute inset-0 bg-dark-800/80 flex items-center justify-center rounded-xl z-10">
                          <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-dark-600 rounded-lg flex items-center justify-center text-xl font-bold">
                            {slotNumber}
                          </div>

                          {save ? (
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{save.playerName}</span>
                                <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded">
                                  Lv.{save.playerLevel}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-dark-400 mt-1">
                                <span>💰 {formatMoney(parseInt(save.playerMoney))}</span>
                                <span>⭐ 평판 {save.playerReputation}</span>
                                <span>📋 {save.completedProjects}개 프로젝트</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-dark-500 mt-1">
                                <span>{getStateLabel(save.gameState)}</span>
                                <span>•</span>
                                <span>Day {save.currentDay}</span>
                                <span>•</span>
                                <span>{formatDate(save.updatedAt)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-dark-400">
                              {isLocked ? (
                                <span className="text-yellow-500">
                                  구독 업그레이드 필요
                                </span>
                              ) : (
                                '빈 슬롯'
                              )}
                            </div>
                          )}
                        </div>

                        {save && !isLocked && (
                          <div className="flex items-center gap-2">
                            {confirmDelete === slotNumber ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(slotNumber);
                                  }}
                                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                                >
                                  삭제 확인
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete(null);
                                  }}
                                  className="text-xs text-dark-400 hover:text-white px-2 py-1"
                                >
                                  취소
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(slotNumber);
                                }}
                                className="text-dark-500 hover:text-red-400 p-1"
                                title="삭제"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
