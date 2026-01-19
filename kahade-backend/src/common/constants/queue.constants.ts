export const QUEUE_NAMES = {
  EMAIL: 'email',
  NOTIFICATION: 'notification',
  BLOCKCHAIN: 'blockchain',
} as const;

export const QUEUE_JOBS = {
  EMAIL: {
    SEND_WELCOME: 'send-welcome-email',
    SEND_VERIFICATION: 'send-verification-email',
    SEND_TRANSACTION_CREATED: 'send-transaction-created-email',
    SEND_PAYMENT_CONFIRMED: 'send-payment-confirmed-email',
    SEND_DISPUTE_CREATED: 'send-dispute-created-email',
  },
  NOTIFICATION: {
    CREATE: 'create-notification',
    SEND_PUSH: 'send-push-notification',
  },
  BLOCKCHAIN: {
    RECORD_TRANSACTION: 'record-transaction',
    VERIFY_TRANSACTION: 'verify-transaction',
  },
} as const;
