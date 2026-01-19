import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const environment = process.env.PAYMENT_ENVIRONMENT || 'sandbox';
  const callbackUrl = process.env.PAYMENT_CALLBACK_URL;

  // SECURITY FIX: Validate payment config in production
  if (nodeEnv === 'production') {
    if (environment === 'sandbox') {
      throw new Error(
        'CRITICAL ERROR: PAYMENT_ENVIRONMENT must be set to "production" in production environment'
      );
    }

    if (!callbackUrl || callbackUrl.startsWith('http://localhost')) {
      throw new Error(
        'CRITICAL ERROR: PAYMENT_CALLBACK_URL must be set to a valid HTTPS URL in production'
      );
    }

    if (callbackUrl && !callbackUrl.startsWith('https://')) {
      throw new Error(
        'CRITICAL SECURITY ERROR: PAYMENT_CALLBACK_URL must use HTTPS in production'
      );
    }
  }

  return {
    gateway: process.env.PAYMENT_GATEWAY || 'midtrans',
    apiKey: process.env.PAYMENT_GATEWAY_API_KEY || '',
    secret: process.env.PAYMENT_GATEWAY_SECRET || '',
    callbackUrl: callbackUrl || 'http://localhost:3000/api/v1/payments/callback',
    successUrl: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:3001/payment/success',
    failedUrl: process.env.PAYMENT_FAILED_URL || 'http://localhost:3001/payment/failed',
    environment,
  };
});
