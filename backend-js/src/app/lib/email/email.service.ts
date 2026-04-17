// TODO: implementar con nodemailer + Resend/SendGrid

export interface TrackingEmailParams {
  to: string;
  recipientName: string;
  trackingCode: string;
  trackingUrl: string;
}

export interface InTransitEmailParams {
  to: string;
  recipientName: string;
  distributorName: string;
  estimatedDelivery: string;
}

export interface DeliveredEmailParams {
  to: string;
  recipientName: string;
  deliveredAt: string;
}

export const emailService = {
  async sendTrackingEmail(params: TrackingEmailParams): Promise<void> {
    // TODO: implementar envío real
    console.log("[stub] sendTrackingEmail", params);
  },

  async sendInTransitEmail(params: InTransitEmailParams): Promise<void> {
    // TODO: implementar envío real
    console.log("[stub] sendInTransitEmail", params);
  },

  async sendDeliveredEmail(params: DeliveredEmailParams): Promise<void> {
    // TODO: implementar envío real
    console.log("[stub] sendDeliveredEmail", params);
  },
};