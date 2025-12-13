'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GDPRDataRequestProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

type RequestType = 'access' | 'export' | 'delete' | 'correction';

export default function GDPRDataRequest({
  isOpen,
  onClose,
  userEmail,
}: GDPRDataRequestProps) {
  const [requestType, setRequestType] = useState<RequestType>('access');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestTypes: { type: RequestType; title: string; description: string }[] = [
    {
      type: 'access',
      title: '개인정보 열람',
      description: '회사가 보유한 본인의 개인정보를 열람합니다.',
    },
    {
      type: 'export',
      title: '데이터 내보내기',
      description: '본인의 개인정보를 휴대 가능한 형식(JSON)으로 다운로드합니다.',
    },
    {
      type: 'correction',
      title: '정보 정정',
      description: '부정확한 개인정보의 정정을 요청합니다.',
    },
    {
      type: 'delete',
      title: '계정 삭제',
      description: '모든 개인정보와 계정을 영구적으로 삭제합니다.',
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/gdpr-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType,
          additionalInfo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
      }

      // For export request, trigger download
      if (requestType === 'export') {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRequestType('access');
    setAdditionalInfo('');
    setSuccess(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-800 border border-dark-600 rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">개인정보 권리 행사</h2>
              <button
                onClick={handleClose}
                className="text-dark-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-dark-400 text-sm mt-1">
              GDPR 및 개인정보보호법에 따른 권리를 행사할 수 있습니다.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">요청이 처리되었습니다</h3>
                <p className="text-dark-400">
                  {requestType === 'export'
                    ? '데이터 다운로드가 시작되었습니다.'
                    : requestType === 'delete'
                    ? '계정 삭제 요청이 접수되었습니다. 이메일로 확인 메일이 발송됩니다.'
                    : '요청이 접수되었습니다. 처리 결과는 이메일로 안내드립니다.'}
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  닫기
                </button>
              </div>
            ) : (
              <>
                {/* Request Type Selection */}
                <div className="space-y-3 mb-6">
                  {requestTypes.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setRequestType(item.type)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        requestType === item.type
                          ? 'bg-primary-500/10 border-primary-500'
                          : 'bg-dark-700/50 border-dark-600 hover:border-dark-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            requestType === item.type
                              ? 'border-primary-500'
                              : 'border-dark-500'
                          }`}
                        >
                          {requestType === item.type && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-dark-400">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Additional Info for Correction */}
                {requestType === 'correction' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      정정할 내용
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="정정이 필요한 정보와 올바른 내용을 입력해주세요..."
                      className="w-full h-24 bg-dark-700 border border-dark-600 rounded-lg p-3 text-white placeholder:text-dark-500 resize-none"
                    />
                  </div>
                )}

                {/* Delete Warning */}
                {requestType === 'delete' && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <h4 className="font-medium text-red-400">주의</h4>
                        <p className="text-sm text-dark-300 mt-1">
                          계정 삭제를 요청하면 모든 게임 데이터, 저장 파일, 업적,
                          구독 정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* User Info */}
                {userEmail && (
                  <div className="mb-6 p-4 bg-dark-700/50 rounded-lg">
                    <div className="text-sm text-dark-400">요청자 이메일</div>
                    <div className="font-medium">{userEmail}</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="p-6 border-t border-dark-700 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (requestType === 'correction' && !additionalInfo)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  requestType === 'delete'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    처리 중...
                  </span>
                ) : (
                  '요청 제출'
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
