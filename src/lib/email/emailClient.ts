import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export class EmailClient {
  private from: string;

  constructor() {
    this.from = process.env.EMAIL_FROM || "KCT Menswear <noreply@kctmenswear.com>";
  }

  async send(options: EmailOptions) {
    try {
      const { data, error } = await resend.emails.send({
        from: options.from || this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        tags: options.tags,
      });

      if (error) {
        throw new Error(`Email send failed: ${error.message}`);
      }

      console.log(`Email sent successfully: ${data?.id}`);
      return data;
    } catch (error) {
      console.error("Email send error:", error);
      throw error;
    }
  }

  async sendBatch(emails: EmailOptions[]) {
    try {
      const { data, error } = await resend.batch.send(
        emails.map((email) => ({
          from: email.from || this.from,
          to: email.to,
          subject: email.subject,
          html: email.html,
          text: email.text,
          replyTo: email.replyTo,
          tags: email.tags,
        }))
      );

      if (error) {
        throw new Error(`Batch email send failed: ${error.message}`);
      }

      console.log(`Batch emails sent: ${data?.data.length} emails`);
      return data;
    } catch (error) {
      console.error("Batch email send error:", error);
      throw error;
    }
  }
}

export const emailClient = new EmailClient();