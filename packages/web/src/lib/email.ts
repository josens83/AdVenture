import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@adventure-game.com';
const APP_NAME = '마케터 생존기';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Generate random token
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Email templates
const emailTemplates = {
  verification: (name: string, verifyUrl: string) => ({
    subject: `[${APP_NAME}] 이메일 인증을 완료해주세요`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Pretendard', -apple-system, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
            <p>마케팅 시뮬레이션 게임</p>
          </div>
          <div class="content">
            <h2>안녕하세요${name ? `, ${name}님` : ''}!</h2>
            <p>${APP_NAME}에 가입해 주셔서 감사합니다.</p>
            <p>아래 버튼을 클릭하여 이메일 인증을 완료해주세요:</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">이메일 인증하기</a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣기 하세요:<br>
              <a href="${verifyUrl}" style="color: #667eea;">${verifyUrl}</a>
            </p>
            <p style="color: #ef4444; font-size: 14px;">
              * 이 링크는 24시간 후에 만료됩니다.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            <p>이 이메일을 요청하지 않으셨다면, 무시하셔도 됩니다.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ${APP_NAME} - 이메일 인증

      안녕하세요${name ? `, ${name}님` : ''}!

      ${APP_NAME}에 가입해 주셔서 감사합니다.
      아래 링크를 클릭하여 이메일 인증을 완료해주세요:

      ${verifyUrl}

      이 링크는 24시간 후에 만료됩니다.

      이 이메일을 요청하지 않으셨다면, 무시하셔도 됩니다.
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: `[${APP_NAME}] 비밀번호 재설정`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Pretendard', -apple-system, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
            <p>비밀번호 재설정</p>
          </div>
          <div class="content">
            <h2>안녕하세요${name ? `, ${name}님` : ''}!</h2>
            <p>비밀번호 재설정을 요청하셨습니다.</p>
            <p>아래 버튼을 클릭하여 새 비밀번호를 설정해주세요:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">비밀번호 재설정</a>
            </p>
            <div class="warning">
              <strong>보안 안내:</strong><br>
              - 이 링크는 1시간 후에 만료됩니다.<br>
              - 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하세요.<br>
              - 계정 보안이 걱정되시면 즉시 비밀번호를 변경해주세요.
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              버튼이 작동하지 않는 경우:<br>
              <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ${APP_NAME} - 비밀번호 재설정

      안녕하세요${name ? `, ${name}님` : ''}!

      비밀번호 재설정을 요청하셨습니다.
      아래 링크를 클릭하여 새 비밀번호를 설정해주세요:

      ${resetUrl}

      이 링크는 1시간 후에 만료됩니다.
      비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하세요.
    `,
  }),

  welcomeEmail: (name: string) => ({
    subject: `[${APP_NAME}] 가입을 환영합니다!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Pretendard', -apple-system, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .feature { display: flex; align-items: center; margin: 15px 0; padding: 15px; background: white; border-radius: 8px; }
          .feature-icon { font-size: 24px; margin-right: 15px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
            <p>마케팅 시뮬레이션 게임</p>
          </div>
          <div class="content">
            <h2>환영합니다${name ? `, ${name}님` : ''}! 🎉</h2>
            <p>이제 당신은 마케터로서의 여정을 시작할 준비가 되었습니다!</p>

            <h3>게임에서 할 수 있는 것들:</h3>
            <div class="feature">
              <span class="feature-icon">🎯</span>
              <div>
                <strong>다양한 클라이언트</strong><br>
                스타트업부터 대기업까지 다양한 클라이언트를 만나보세요
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">📊</span>
              <div>
                <strong>마케팅 전략 수립</strong><br>
                SEO, SNS, 광고, 콘텐츠 마케팅 등 다양한 채널을 활용하세요
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">🏆</span>
              <div>
                <strong>업적 달성</strong><br>
                30개 이상의 업적을 달성하고 보상을 받으세요
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">🥇</span>
              <div>
                <strong>리더보드 경쟁</strong><br>
                전 세계 플레이어들과 순위를 겨뤄보세요
              </div>
            </div>

            <p style="text-align: center;">
              <a href="${APP_URL}" class="button">지금 게임 시작하기</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ${APP_NAME}에 오신 것을 환영합니다!

      안녕하세요${name ? `, ${name}님` : ''}!

      이제 당신은 마케터로서의 여정을 시작할 준비가 되었습니다!

      게임에서 할 수 있는 것들:
      - 다양한 클라이언트와 함께 일하기
      - 마케팅 전략 수립 및 실행
      - 30개 이상의 업적 달성
      - 전 세계 플레이어들과 순위 경쟁

      지금 바로 시작하세요: ${APP_URL}
    `,
  }),

  subscriptionConfirm: (name: string, tier: string, amount: string) => ({
    subject: `[${APP_NAME}] 구독이 활성화되었습니다`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Pretendard', -apple-system, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .receipt-row:last-child { border-bottom: none; font-weight: bold; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
            <p>구독 확인</p>
          </div>
          <div class="content">
            <h2>감사합니다${name ? `, ${name}님` : ''}! 🎉</h2>
            <p>${tier} 플랜 구독이 성공적으로 활성화되었습니다.</p>

            <div class="receipt">
              <h3 style="margin-top: 0;">결제 내역</h3>
              <div class="receipt-row">
                <span>플랜</span>
                <span>${tier}</span>
              </div>
              <div class="receipt-row">
                <span>결제 금액</span>
                <span>${amount}</span>
              </div>
              <div class="receipt-row">
                <span>결제일</span>
                <span>${new Date().toLocaleDateString('ko-KR')}</span>
              </div>
            </div>

            <p style="text-align: center;">
              <a href="${APP_URL}/settings" class="button">구독 관리하기</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            <p>구독 관련 문의: support@adventure-game.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ${APP_NAME} - 구독 확인

      감사합니다${name ? `, ${name}님` : ''}!

      ${tier} 플랜 구독이 성공적으로 활성화되었습니다.

      결제 내역:
      - 플랜: ${tier}
      - 결제 금액: ${amount}
      - 결제일: ${new Date().toLocaleDateString('ko-KR')}

      구독 관리: ${APP_URL}/settings
    `,
  }),
};

// Send email functions
export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string
): Promise<boolean> {
  try {
    const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}`;
    const template = emailTemplates.verification(name || '', verifyUrl);

    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name?: string
): Promise<boolean> {
  try {
    const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
    const template = emailTemplates.passwordReset(name || '', resetUrl);

    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(
  email: string,
  name?: string
): Promise<boolean> {
  try {
    const template = emailTemplates.welcomeEmail(name || '');

    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function sendSubscriptionConfirmEmail(
  email: string,
  tier: string,
  amount: string,
  name?: string
): Promise<boolean> {
  try {
    const template = emailTemplates.subscriptionConfirm(name || '', tier, amount);

    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
    return false;
  }
}

// Verify SMTP connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
}
