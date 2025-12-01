// src/api/email.api.ts
import axiosInstance from '@/lib/axios';

export type EmailTemplate = 'admin_invitation' | 'forgot_password' | 'welcome';

export interface AdminInvitationData {
  recipientName?: string;
  inviteLink: string;
  inviterName?: string;
  organizationName?: string;
}

export interface ForgotPasswordData {
  recipientName?: string;
  resetLink: string;
  expiresInMinutes?: number;
}

export interface WelcomeEmailData {
  recipientName?: string;
  loginLink?: string;
  organizationName?: string;
}

export interface SendEmailPayload {
  template: EmailTemplate;
  to: string;
  data: AdminInvitationData | ForgotPasswordData | WelcomeEmailData;
  cc?: string[];
  bcc?: string[];
}

export interface SendEmailResponse {
  message: string;
  messageId: string;
  previewUrl: string | null;
}

export const emailApi = {
  /**
   * Send an admin invitation email
   */
  sendAdminInvitation: async (
    to: string,
    data: AdminInvitationData
  ): Promise<SendEmailResponse> => {
    const payload: SendEmailPayload = {
      template: 'admin_invitation',
      to,
      data,
    };
    const response = await axiosInstance.post('/emails', payload);
    return response.data;
  },

  /**
   * Send a forgot password email
   */
  sendForgotPassword: async (
    to: string,
    data: ForgotPasswordData
  ): Promise<SendEmailResponse> => {
    const payload: SendEmailPayload = {
      template: 'forgot_password',
      to,
      data,
    };
    const response = await axiosInstance.post('/emails', payload);
    return response.data;
  },

  /**
   * Send a welcome email
   */
  sendWelcome: async (
    to: string,
    data: WelcomeEmailData
  ): Promise<SendEmailResponse> => {
    const payload: SendEmailPayload = {
      template: 'welcome',
      to,
      data,
    };
    const response = await axiosInstance.post('/emails', payload);
    return response.data;
  },

  /**
   * Generic send templated email
   */
  sendTemplatedEmail: async (payload: SendEmailPayload): Promise<SendEmailResponse> => {
    const response = await axiosInstance.post('/emails', payload);
    return response.data;
  },
};

