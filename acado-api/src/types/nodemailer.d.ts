declare module 'nodemailer' {
  interface Address {
    name?: string;
    address: string;
  }

  interface Envelope {
    from?: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
  }

  export interface SentMessageInfo {
    envelope: Envelope;
    messageId: string;
    message: string;
    accepted: Array<string | Address>;
    rejected: Array<string | Address>;
    pending: Array<string | Address>;
    response: string;
  }

  export interface TransporterOptions {
    [key: string]: unknown;
  }

  export interface SendMailOptions {
    to: string | string[] | Address | Address[];
    cc?: string | string[] | Address | Address[];
    bcc?: string | string[] | Address | Address[];
    from?: string | Address;
    subject?: string;
    text?: string;
    html?: string;
    [key: string]: unknown;
  }

  export interface Transporter {
    sendMail(options: SendMailOptions): Promise<SentMessageInfo>;
    options?: TransporterOptions;
  }

  interface Nodemailer {
    createTransport(options: TransporterOptions): Transporter;
    getTestMessageUrl(info: SentMessageInfo): string | false;
  }

  const nodemailer: Nodemailer;

  export { Transporter, SentMessageInfo, Envelope, SendMailOptions };
  export default nodemailer;
}

