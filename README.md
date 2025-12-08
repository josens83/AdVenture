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

## 주요 기능

### 사용자 인증 시스템
- **소셜 로그인**: Google, GitHub OAuth 지원
- **이메일/비밀번호**: 자체 회원가입 및 로그인
- **세션 관리**: NextAuth.js 기반 안전한 인증

### 데이터베이스
- **PostgreSQL + Prisma**: 관계형 데이터베이스
- **게임 저장**: 클라우드 저장/불러오기
- **리더보드**: 실시간 순위 시스템

### 서버사이드 검증
- **치팅 방지**: 서버에서 게임 결과 검증
- **데이터 무결성**: 모든 액션 서버 검증

### 분석 시스템
- **Google Analytics 4**: 페이지뷰, 이벤트 트래킹
- **커스텀 분석**: 게임 내 행동 분석
- **대시보드**: 일별/주별/월별 통계

### 결제 시스템
- **Stripe 연동**: 구독 결제 처리
- **웹훅**: 결제 상태 실시간 동기화
- **구독 관리**: 플랜 업그레이드/다운그레이드

## 프로젝트 구조

```
AdVenture/
├── packages/
│   ├── shared/           # 공유 게임 로직, 타입, 상수
│   │   ├── constants/    # 클라이언트, 채널, 이벤트, 업적
│   │   ├── game/         # 게임 엔진
│   │   ├── types/        # TypeScript 타입
│   │   └── utils/        # 유틸리티 함수
│   │
│   ├── web/              # Next.js 14 웹 애플리케이션
│   │   ├── prisma/       # 데이터베이스 스키마
│   │   ├── src/
│   │   │   ├── app/      # App Router 페이지
│   │   │   ├── components/
│   │   │   ├── lib/      # 유틸리티 (auth, prisma, analytics)
│   │   │   └── store/    # Zustand 상태관리
│   │   └── ...
│   │
│   └── mobile/           # React Native/Expo 앱
│       ├── src/
│       │   └── screens/  # 모바일 화면
│       └── ...
│
├── package.json          # 모노레포 설정
└── README.md
```

## 기술 스택

### 공유 (Shared)
- TypeScript
- UUID

### 웹 (Web)
- **프레임워크**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS, Framer Motion
- **상태관리**: Zustand
- **인증**: NextAuth.js (Google, GitHub, Credentials)
- **데이터베이스**: PostgreSQL, Prisma ORM
- **결제**: Stripe
- **분석**: Google Analytics 4, 커스텀 분석

### 모바일 (Mobile)
- React Native
- Expo SDK 50
- React Navigation
- AsyncStorage
- Zustand

## 설치 및 실행

### 요구사항
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (로컬 또는 클라우드)

### 설치

```bash
# 저장소 클론
git clone https://github.com/josens83/AdVenture.git
cd AdVenture

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example packages/web/.env

# 데이터베이스 설정 (PostgreSQL 필요)
cd packages/web
npx prisma generate
npx prisma db push

# 공유 패키지 빌드
cd ../..
npm run build:shared
```

### 웹 실행

```bash
# 개발 서버 실행
npm run dev:web

# 빌드
npm run build:web

# 프로덕션 실행
npm run start --workspace=packages/web
```

웹 애플리케이션: http://localhost:3000

### 모바일 실행

```bash
# Expo 개발 서버 실행
npm run dev:mobile

# iOS 시뮬레이터
cd packages/mobile && npx expo start --ios

# Android 에뮬레이터
cd packages/mobile && npx expo start --android
```

### 데이터베이스 관리

```bash
cd packages/web

# 마이그레이션 생성
npm run db:migrate

# 스키마 동기화 (개발용)
npm run db:push

# Prisma Studio (GUI)
npm run db:studio
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `GET/POST /api/auth/[...nextauth]` - NextAuth 핸들러

### 게임
- `GET /api/game/save` - 저장 목록 조회
- `POST /api/game/save` - 게임 저장
- `DELETE /api/game/save?slot=1` - 저장 삭제
- `POST /api/game/validate` - 게임 액션 검증
- `GET /api/game/leaderboard` - 리더보드 조회

### 결제
- `POST /api/payment/create-checkout` - 결제 세션 생성
- `POST /api/subscription/webhook` - Stripe 웹훅

### 분석
- `POST /api/analytics/track` - 이벤트 기록
- `GET /api/analytics/track` - 분석 데이터 조회 (관리자)

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
| 가격 (연) | 무료 | ₩49,000 | ₩99,000 | ₩499,000 |

## 환경 변수

자세한 내용은 `.env.example` 파일을 참조하세요.

### 필수 변수
```env
# 데이터베이스
DATABASE_URL=postgresql://user:password@localhost:5432/adventure

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth (하나 이상 필요)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 선택 변수
```env
# Stripe (결제 사용 시)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
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

## 배포

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd packages/web
vercel
```

### Docker
```dockerfile
# 예시 Dockerfile은 별도 제공 예정
```

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
