import { resendClient } from "./resend.config";
import { packageInTransitTemplate } from "./templates/packageInTransit.template";
import { packageDeliveredTemplate } from "./templates/packageDelivered.template";
import { packageAssignedTemplate } from "./templates/packageAssigned.template";
import { packageFailedEmailTemplate } from "./templates/packageFailed.template";
import { packagePendingTemplate } from "./templates/packagePending.template";
import { packageUndeliveredTemplate } from "./templates/packageUndelivered.template";
import { passwordChangeEmailTemplate } from "./templates/passwordChangeEmail.template";
import { accountActivationTemplate } from "./templates/accountActivation.template";
import {
  ActivationEmailParams,
  DeliveredEmailParams,
  FailedEmailParams,
  InTransitEmailParams,
  PendingEmailParams,
  ResetPasswordEmailParams,
  TrackingEmailParams,
  UndeliveredEmailParams,
} from "./types";

const FROM = "PakAG <no-reply@tolosaerronka.es>";

export const emailService = {
  async sendAssignedEmail(params: TrackingEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: "Your package tracking code — PakAG",
      html: packageAssignedTemplate({
        recipientName: params.recipientName,
        trackingUrl: params.trackingUrl,
      }),
    });
  },

  async sendInTransitEmail(params: InTransitEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: "Your package is in transit — PakAG",
      html: packageInTransitTemplate({
        recipientName: params.recipientName,
        trackingUrl: params.trackingUrl,
        distributorName: params.distributorName,
        estimatedDelivery: params.estimatedDelivery,
      }),
    });
  },

  async sendDeliveredEmail(params: DeliveredEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: "Your package has been delivered — PakAG",
      html: packageDeliveredTemplate({
        recipientName: params.recipientName,
        trackingUrl: params.trackingUrl,
        deliveredAt: params.deliveredAt,
      }),
    });
  },

  async sendFailedEmail(params: FailedEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: "Delivery attempt failed — PakAG",
      html: packageFailedEmailTemplate({
        recipientName: params.recipientName,
        failedAt: params.failedAt,
        reason: params.reason,
      }),
    });
  },

  async sendPendingEmail(params: PendingEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: "We received your package — PakAG",
      html: packagePendingTemplate({
        recipientName: params.recipientName,
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
      subject: "Reset your password — PakAG",
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
      subject: "Activate your PakAG account",
      html: accountActivationTemplate({
        recipientName: params.recipientName,
        activationUrl: params.activationUrl,
      }),
    });
  },

  async sendUndeliveredEmail(params: UndeliveredEmailParams): Promise<void> {
    await resendClient.emails.send({
      from: FROM,
      to: params.to,
      subject: "Your package could not be delivered today — PakAG",
      html: packageUndeliveredTemplate({
        recipientName: params.recipientName,
        attemptedAt: params.attemptedAt,
      }),
    });
  },
};
