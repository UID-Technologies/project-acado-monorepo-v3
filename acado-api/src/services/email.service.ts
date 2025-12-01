// src/services/email.service.ts
import nodemailer, { type Transporter, type SentMessageInfo } from 'nodemailer';
import { loadEnv } from '../config/env.js';
import { logger } from '../config/logger.js';

export type EmailTemplate = 'admin_invitation' | 'forgot_password' | 'welcome';

export interface BaseTemplateInput {
  recipientName?: string;
}

export interface AdminInvitationInput extends BaseTemplateInput {
  inviteLink: string;
  inviterName?: string;
  organizationName?: string;
}

export interface ForgotPasswordInput extends BaseTemplateInput {
  resetLink: string;
  expiresInMinutes?: number;
}

export interface WelcomeInput extends BaseTemplateInput {
  loginLink?: string;
  organizationName?: string;
}

type TemplateInputMap = {
  admin_invitation: AdminInvitationInput;
  forgot_password: ForgotPasswordInput;
  welcome: WelcomeInput;
};

export interface SendTemplateEmailOptions<T extends EmailTemplate = EmailTemplate> {
  to: string;
  template: T;
  data: TemplateInputMap[T];
  cc?: string[];
  bcc?: string[];
}

export interface EmailSendResult {
  messageId: string;
  previewUrl?: string;
  envelope?: SentMessageInfo['envelope'];
}

const env = loadEnv();

// --------------------------------------------------
// SMTP Transporter (Azure SMTP)
// --------------------------------------------------
function createTransport(): Transporter {
  const hasSmtpCredentials =
    Boolean(env.EMAIL_HOST) &&
    Boolean(env.EMAIL_USER) &&
    Boolean(env.EMAIL_PASSWORD);

  if (hasSmtpCredentials) {
    logger.info(
      {
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: false,
      },
      'Configuring SMTP email transport (Azure)'
    );

    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,   // 587
      secure: false,          // STARTTLS required
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
    });
  }

  logger.warn('SMTP not configured → JSON transport fallback');
  return nodemailer.createTransport({ jsonTransport: true });
}

const transporter = createTransport();

// --------------------------------------------------
// TEMPLATES
// --------------------------------------------------
interface CompiledTemplate {
  subject: string;
  html: string;
  text: string;
}

const templateBuilders: Record<EmailTemplate, (data: any) => CompiledTemplate> = {
  admin_invitation: (data: AdminInvitationInput) => ({
    subject: `You're invited to join ${data.organizationName ?? 'ACADO'} admin portal`,
    text: [
      `Hi ${data.recipientName ?? 'there'},`,
      '',
      `${data.inviterName ?? 'Someone'} invited you to become an administrator.`,
      'Use the link below to continue:',
      data.inviteLink,
      '',
      'Best regards,',
      `${data.organizationName ?? 'ACADO'} Team`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial; line-height: 1.6;">
        <p>Hi ${data.recipientName ?? 'there'},</p>
        <p>You have been invited by <strong>${data.inviterName ?? 'someone'}</strong>
        to join <strong>${data.organizationName ?? 'ACADO'}</strong> as an admin.</p>
        <p style="margin: 20px 0;">
          <a href="${data.inviteLink}" style="background:#1f2937;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
            Accept Invitation
          </a>
        </p>
        <p>Link: <a href="${data.inviteLink}">${data.inviteLink}</a></p>
        <p>Regards,<br/>${data.organizationName ?? 'ACADO'} Team</p>
      </div>
    `,
  }),

  forgot_password: (data: ForgotPasswordInput) => ({
    subject: 'Reset your password',
    text: [
      `Hi ${data.recipientName ?? 'there'},`,
      '',
      'We received a request to reset your password.',
      `This link expires in ${data.expiresInMinutes ?? 60} minutes.`,
      data.resetLink,
      '',
      'If you did not request this, ignore the message.',
      '',
      'ACADO Support',
    ].join('\n'),
    html: `
      <div style="font-family: Arial; line-height: 1.6;">
        <p>Hi ${data.recipientName ?? 'there'},</p>
        <p>You requested a password reset. This link expires in ${
          data.expiresInMinutes ?? 60
        } minutes.</p>
        <p style="margin: 20px 0;">
          <a href="${data.resetLink}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p>Link: <a href="${data.resetLink}">${data.resetLink}</a></p>
        <p>Regards,<br/>ACADO Support</p>
      </div>
    `,
  }),

  welcome: (data: WelcomeInput) => ({
    subject: `Welcome to ${data.organizationName ?? 'ACADO'}!`,
    text: [
      `Hi ${data.recipientName ?? 'there'},`,
      '',
      `Welcome to ${data.organizationName ?? 'ACADO'}!`,
      'Login using the link below:',
      data.loginLink ?? 'https://app.acado.ai/login',
      '',
      'Cheers,',
      `${data.organizationName ?? 'ACADO'} Team`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial; line-height: 1.6;">
        <p>Hi ${data.recipientName ?? 'there'},</p>
        <p>Welcome to <strong>${data.organizationName ?? 'ACADO'}</strong>!</p>
        <p style="margin: 20px 0;">
          <a href="${data.loginLink ?? 'https://app.acado.ai/login'}"
             style="background:#10b981;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
             Go to Dashboard
          </a>
        </p>
        <p>Cheers,<br/>${data.organizationName ?? 'ACADO'} Team</p>
      </div>
    `,
  }),
};

// --------------------------------------------------
// Template Compiler
// --------------------------------------------------
function compileTemplate<T extends EmailTemplate>(
  template: T,
  data: TemplateInputMap[T],
): CompiledTemplate {
  const builder = templateBuilders[template];
  if (!builder) {
    throw new Error(`Unsupported email template: ${template}`);
  }
  return builder(data);
}

// --------------------------------------------------
// SEND EMAIL
// --------------------------------------------------
export async function sendTemplatedEmail<T extends EmailTemplate>(
  options: SendTemplateEmailOptions<T>,
): Promise<EmailSendResult> {
  const { template, data, to, cc, bcc } = options;

  const compiled = compileTemplate(template, data);

  const info = await transporter.sendMail({
    to,
    cc,
    bcc,
    from: env.EMAIL_FROM,
    subject: compiled.subject,
    html: compiled.html,
    text: compiled.text,
  });

  logger.info({ template, to, messageId: info.messageId }, 'Email sent');

  const previewUrl =
    typeof nodemailer.getTestMessageUrl === 'function'
      ? nodemailer.getTestMessageUrl(info) || undefined
      : undefined;

  return {
    messageId: info.messageId,
    previewUrl,
    envelope: info.envelope,
  };
}
