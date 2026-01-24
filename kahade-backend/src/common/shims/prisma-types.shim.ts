// ============================================================================
// PRISMA TYPES SHIM - Production Ready
// All types that are used across the application
// ============================================================================

export enum OrderCategory {
  ELECTRONICS = 'ELECTRONICS',
  SERVICES = 'SERVICES',
  DIGITAL_GOODS = 'DIGITAL_GOODS',
  PHYSICAL_GOODS = 'PHYSICAL_GOODS',
  OTHER = 'OTHER',
}

export enum InitiatorRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

export enum FeePayer {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  SPLIT = 'SPLIT',
  FIFTY_FIFTY = 'FIFTY_FIFTY',
}

export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
}

export enum OrderStatus {
  WAITING_COUNTERPARTY = 'WAITING_COUNTERPARTY',
  PENDING_ACCEPT = 'PENDING_ACCEPT',
  ACCEPTED = 'ACCEPTED',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
  REFUNDED = 'REFUNDED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum KYCStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
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

export enum DisputeStatus {
  OPEN = 'OPEN',
  RESPONDED = 'RESPONDED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  UNDER_ARBITRATION = 'UNDER_ARBITRATION',
  AWAITING_RESPONSE = 'AWAITING_RESPONSE',
  DECIDED = 'DECIDED',
  APPEALED = 'APPEALED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
}

export enum DisputeDecision {
  PENDING = 'PENDING',
  BUYER_WINS = 'BUYER_WINS',
  SELLER_WINS = 'SELLER_WINS',
  SPLIT = 'SPLIT',
  CANCELLED = 'CANCELLED',
  RELEASE_ALL_TO_SELLER = 'RELEASE_ALL_TO_SELLER',
  REFUND_ALL_TO_BUYER = 'REFUND_ALL_TO_BUYER',
  SPLIT_SETTLEMENT = 'SPLIT_SETTLEMENT',
  CANCEL_VOID = 'CANCEL_VOID',
}

export enum EscrowHoldStatus {
  ACTIVE = 'ACTIVE',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
  ADJUSTED = 'ADJUSTED',
}

export enum JournalType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  ESCROW_LOCK = 'ESCROW_LOCK',
  ESCROW_RELEASE = 'ESCROW_RELEASE',
  TRANSFER = 'TRANSFER',
  FEE = 'FEE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
}

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

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_UPDATED = 'TRANSACTION_UPDATED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  WALLET_TOPUP = 'WALLET_TOPUP',
  WALLET_WITHDRAW = 'WALLET_WITHDRAW',
}

// Type aliases for Prisma models
export type Transaction = any;
export type Order = any;
export type User = any;
export type Notification = any;
export type Wallet = any;
export type Withdrawal = any;
export type WalletTransaction = any;
export type Dispute = any;
export type EscrowHold = any;
export type LedgerJournal = any;
export type LedgerEntry = any;
export type LedgerAccount = any;

export interface IOrderResponse {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  category: OrderCategory;
  currency: Currency;
  amount: number;
  status: OrderStatus;
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
  category: OrderCategory;
  currency: Currency;
  amount: number;
  status: OrderStatus;
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
