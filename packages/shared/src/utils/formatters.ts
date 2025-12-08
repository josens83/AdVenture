// Number formatting utilities

export const formatMoney = (amount: number, currency: string = 'KRW'): string => {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatCompactMoney = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만`;
  }
  return formatMoney(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDuration = (days: number): string => {
  if (days < 7) {
    return `${days}일`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return remainingDays > 0 ? `${weeks}주 ${remainingDays}일` : `${weeks}주`;
  }
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  return remainingDays > 0 ? `${months}개월 ${remainingDays}일` : `${months}개월`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return '방금 전';
  }
  if (diffMins < 60) {
    return `${diffMins}분 전`;
  }
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  return formatDate(date);
};

// Metric formatting
export const formatCTR = (ctr: number): string => {
  return `${ctr.toFixed(2)}%`;
};

export const formatCPC = (cpc: number): string => {
  return formatMoney(Math.round(cpc));
};

export const formatCPA = (cpa: number): string => {
  return formatMoney(Math.round(cpa));
};

export const formatROAS = (roas: number): string => {
  return `${roas.toFixed(2)}x`;
};

// Level and experience
export const formatLevel = (level: number): string => {
  return `Lv.${level}`;
};

export const formatExperience = (current: number, total: number): string => {
  return `${formatNumber(current)} / ${formatNumber(total)} XP`;
};
