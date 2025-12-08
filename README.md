# 마케터 생존기 (Marketing Simulator)

실제 마케팅을 배우는 시뮬레이션 게임. 클라이언트를 수주하고, 전략을 세우고, 성과를 만들어내세요!

## 게임 소개

"마케터 생존기"는 디지털 마케팅의 세계를 체험할 수 있는 교육용 시뮬레이션 게임입니다. 플레이어는 마케팅 에이전시의 신입 마케터로 시작하여, 다양한 클라이언트의 프로젝트를 수주하고 성공시키며 성장해 나갑니다.

### 핵심 게임플레이

1. **클라이언트 수주**: 다양한 업종과 난이도의 클라이언트 중 선택
2. **전략 수립**: SEO, SNS, 유료광고, 콘텐츠 마케팅 등 채널별 예산 배분
3. **실행 시뮬레이션**: 랜덤 이벤트와 함께 마케팅 캠페인 실행
4. **결과 분석**: KPI 달성 여부에 따른 정산 및 평판 변동
5. **성장**: 레벨업, 새로운 채널 해금, 더 큰 프로젝트 도전

## 프로젝트 구조

```
AdVenture/
├── packages/
│   ├── shared/        # 공유 게임 로직, 타입, 상수
│   ├── web/           # Next.js 웹 애플리케이션
│   ├── mobile/        # React Native/Expo 모바일 앱
│   └── api/           # Backend API (선택적)
├── package.json       # 모노레포 설정
└── README.md
```

## 기술 스택

### 공유 (Shared)
- TypeScript
- UUID

### 웹 (Web)
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- Zustand (상태관리)
- Stripe (결제)

### 모바일 (Mobile)
- React Native
- Expo SDK 50
- React Navigation
- Expo Linear Gradient
- AsyncStorage
- Zustand

## 설치 및 실행

### 요구사항
- Node.js >= 18.0.0
- npm >= 9.0.0

### 설치

```bash
# 저장소 클론
git clone https://github.com/josens83/AdVenture.git
cd AdVenture

# 의존성 설치
npm install

# 공유 패키지 빌드
npm run build:shared
```

### 웹 실행

```bash
# 개발 서버 실행
npm run dev:web

# 빌드
npm run build:web
```

웹 애플리케이션: http://localhost:3000

### 모바일 실행

```bash
# Expo 개발 서버 실행
npm run dev:mobile

# iOS 시뮬레이터
cd packages/mobile && expo start --ios

# Android 에뮬레이터
cd packages/mobile && expo start --android
```

## 구독 플랜

| 기능 | 무료 | 스타터 | 프로 | 엔터프라이즈 |
|------|------|--------|------|--------------|
| 기본 클라이언트 | ✓ | ✓ | ✓ | ✓ |
| 중급/고급 클라이언트 | ✗ | ✓ | ✓ | ✓ |
| 기본 채널 (4개) | ✓ | ✓ | ✓ | ✓ |
| 모든 채널 (6개) | ✗ | ✓ | ✓ | ✓ |
| 저장 슬롯 | 1개 | 3개 | 무제한 | 무제한 |
| 광고 없음 | ✗ | ✓ | ✓ | ✓ |
| 리더보드 | ✗ | ✓ | ✓ | ✓ |
| 팀원 고용 | ✗ | 2명 | 5명 | 10명 |
| 커스텀 시나리오 | ✗ | ✗ | ✗ | ✓ |
| 가격 (월) | 무료 | ₩4,900 | ₩9,900 | ₩49,900 |

## 환경 변수

```env
# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...

# NextAuth (선택)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Database (선택)
DATABASE_URL=your-database-url
```

## 게임 메커니즘

### 평판 시스템
- 시작 평판: 50점
- 프로젝트 성공: +15점
- 프로젝트 실패: -10점
- 평판 0점: 게임 오버

### 자금 시스템
- 시작 자금: 500만원
- 프로젝트 성공: 예산 × 1.2 지급
- 프로젝트 실패: 예산 × 0.5 지급
- 자금 0원: 게임 오버

### 레벨 시스템
- 프로젝트 완료 시 경험치 획득
- 레벨업 시 새로운 채널/클라이언트 해금
- 난이도가 높을수록 경험치 배율 증가

### 마케팅 채널

| 채널 | 효과 속도 | 비용 | 해금 레벨 |
|------|----------|------|----------|
| SEO 최적화 | 느림 | 저렴 | 1 |
| SNS 마케팅 | 보통 | 보통 | 1 |
| 유료 광고 | 빠름 | 비쌈 | 1 |
| 콘텐츠 마케팅 | 느림 | 저렴 | 1 |
| 이메일 마케팅 | 빠름 | 저렴 | 3 |
| 인플루언서 마케팅 | 즉시 | 매우 비쌈 | 5 |

## 라이선스

MIT License

## 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 연락처

- GitHub: https://github.com/josens83/AdVenture
