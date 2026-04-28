import { resendClient } from './resend.config';
import { accountActivationTemplate } from './templates/accountActivation.template';
import { loginNotificationTemplate } from './templates/loginNotification.template';
import { packageAssignedTemplate } from './templates/packageAssigned.template';
import { packageDeliveredTemplate } from './templates/packageDelivered.template';
import { packageFailedEmailTemplate } from './templates/packageFailed.template';
import { packageInTransitTemplate } from './templates/packageInTransit.template';
import { packagePendingTemplate } from './templates/packagePending.template';
import { packageUndeliveredTemplate } from './templates/packageUndelivered.template';
import { passwordChangeEmailTemplate } from './templates/passwordChangeEmail.template';
import {
  ActivationEmailParams,
  AssignedEmailParams,
  DeliveredEmailParams,
  FailedEmailParams,
  InTransitEmailParams,
  LoginNotificationEmailParams,
  PendingEmailParams,
  ResetPasswordEmailParams,
  UndeliveredEmailParams,
} from './types';

const FROM = 'PakAG <no-reply@tolosaerronka.es>';

export const emailService = {
  async sendAssignedEmail(params: AssignedEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Zure paketea banatzaile bati esleitu diogu - PakAG',
      html: packageAssignedTemplate({
        recipientName: params.recipientName,
        trackingUrl: params.trackingUrl,
        estimatedDelivery: params.estimatedDelivery,
      }),
    });
  },

  async sendInTransitEmail(params: InTransitEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Zure paketea gaur bidean dago - PakAG',
      html: packageInTransitTemplate({
        recipientName: params.recipientName,
        distributorName: params.distributorName,
        estimatedDelivery: params.estimatedDelivery,
        trackingUrl: params.trackingUrl,
      }),
    });
  },

  async sendDeliveredEmail(params: DeliveredEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Zure paketea entregatu dugu - PakAG',
      html: packageDeliveredTemplate({
        recipientName: params.recipientName,
        deliveredAt: params.deliveredAt,
        trackingUrl: params.trackingUrl,
      }),
    });
  },

  async sendFailedEmail(params: FailedEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Ezin izan dugu zure paketea entregatu - PakAG',
      html: packageFailedEmailTemplate({
        recipientName: params.recipientName,
        failedAt: params.failedAt,
        reason: params.reason,
        trackingUrl: params.trackingUrl,
      }),
    });
  },

  async sendPendingEmail(params: PendingEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Zure paketea erregistratu dugu - PakAG',
      html: packagePendingTemplate({
        recipientName: params.recipientName,
        trackingUrl: params.trackingUrl,
      }),
    });
  },

  async sendUndeliveredEmail(params: UndeliveredEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Gaur ezin izan dugu zure paketea entregatu - PakAG',
      html: packageUndeliveredTemplate({
        recipientName: params.recipientName,
        attemptedAt: params.attemptedAt,
        trackingUrl: params.trackingUrl,
      }),
    });
  },

  async sendResetPasswordEmail(
    params: ResetPasswordEmailParams
  ): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Berrezarri zure pasahitza - PakAG',
      html: passwordChangeEmailTemplate({
        recipientName: params.recipientName,
        changePasswordUrl: params.resetUrl,
      }),
    });
  },

  async sendActivationEmail(params: ActivationEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Aktibatu zure PakAG kontua',
      html: accountActivationTemplate({
        recipientName: params.recipientName,
        activationUrl: params.activationUrl,
      }),
    });
  },

  async sendLoginNotificationEmail(
    params: LoginNotificationEmailParams
  ): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: 'Saio berria zure kontuan - PakAG',
      html: loginNotificationTemplate({
        recipientName: params.recipientName,
        loginAt: params.loginAt,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      }),
    });
  },
};
