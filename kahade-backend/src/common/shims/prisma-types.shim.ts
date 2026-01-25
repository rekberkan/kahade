// ============================================================================
// PRISMA TYPES SHIM - Production Ready
// All types that are used across the application
// This file should be kept in sync with prisma/schema/00_base.prisma
// ============================================================================

// Re-export enums from Prisma client for type safety
export {
  OrderCategory,
  InitiatorRole,
  FeePayer,
  Currency,
  OrderStatus,
  EscrowHoldStatus,
  DisputeStatus,
  DisputeDecision,
  KYCStatus,
  WithdrawalStatus,
  JournalType,
  PaymentStatus,
  PaymentProvider,
  PaymentType,
  PaymentMethod,
  ActivityType,
  LedgerAccountType,
  WebhookStatus,
  DepositStatus,
  ReferralStatus,
  ReferralRewardType,
  ReferralRewardStatus,
  VoucherType,
  VoucherStatus,
  PromoTargetType,
  ScheduledJobStatus,
} from '@prisma/client';

// Re-export types from Prisma client
export type {
  User,
  Order,
  Wallet,
  Withdrawal,
  Dispute,
  EscrowHold,
  Notification,
  LedgerJournal,
  LedgerEntry,
  LedgerAccount,
  Payment,
  BankAccount,
  KYCSubmission,
  Rating,
  ReferralCode,
  ReferralUsage,
  ReferralReward,
  Promo,
  Voucher,
  VoucherUsage,
  UserActivity,
  AuditLog,
  SystemConfig,
  ScheduledJob,
  WebhookEvent,
  Deposit,
  DeliveryProof,
  DisputeEvidence,
  DisputeTimeline,
  OrderSettlement,
  WalletAdjustment,
} from '@prisma/client';

// Legacy type aliases for backward compatibility
export type Transaction = import('@prisma/client').Order;
export type WalletTransaction = import('@prisma/client').WalletAdjustment;
export type KYCDocument = import('@prisma/client').KYCSubmission;
export type Referral = import('@prisma/client').ReferralCode;
export type Activity = import('@prisma/client').UserActivity;
export type WebhookLog = import('@prisma/client').WebhookEvent;

// Custom enums not in Prisma (for application logic)
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

export enum NotificationType {
  TRANSACTION = 'TRANSACTION',
  DISPUTE = 'DISPUTE',
  PAYMENT = 'PAYMENT',
  SYSTEM = 'SYSTEM',
  WALLET = 'WALLET',
  KYC = 'KYC',
}

export enum WalletTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  ESCROW_LOCK = 'ESCROW_LOCK',
  ESCROW_RELEASE = 'ESCROW_RELEASE',
  REFUND = 'REFUND',
  FEE = 'FEE',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum BankAccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface IOrderResponse {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  category: string;
  currency: string;
  amount: number;
  status: string;
  initiatorId: string;
  counterpartyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionResponse {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  category: string;
  currency: string;
  amount: number;
  status: string;
  initiatorId: string;
  counterpartyId?: string;
  initiatorRole?: string;
  platformFee?: number;
  feePayer?: string;
  terms?: string;
  inviteToken?: string;
  inviteExpiresAt?: Date;
  acceptedAt?: Date;
  paidAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  disputedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  initiator?: any;
  counterparty?: any;
  escrowHold?: any;
  deliveryProof?: any;
  dispute?: any;
  ratings?: any[];
}

// Journal with entries type for ledger operations
export interface JournalWithEntries {
  id: string;
  createdAt: Date;
  description: string;
  currency: string;
  amountMinor: bigint;
  type: string;
  orderId: string | null;
  disputeId: string | null;
  entries: Array<{
    id: string;
    accountId: string;
    debitMinor: bigint;
    creditMinor: bigint;
  }>;
}
