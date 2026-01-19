import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
  secret: process.env.PAYMENT_GATEWAY_SECRET,
  callbackUrl: process.env.PAYMENT_CALLBACK_URL || 'http://localhost:3000/api/v1/payments/callback',
  environment: process.env.PAYMENT_ENVIRONMENT || 'sandbox',
}));
