// import { TransactionStatus } from '@prisma/client';

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

import { Decimal } from '@prisma/client/runtime/library';

export interface ITransaction {
  id: string;
  title: string;
  description?: string;
  amountMinor: bigint;
  currency: string;
  status: OrderStatus;
  // ... other fields based on schema
}

export enum OrderStatus {
  PENDING_ACCEPT = 'PENDING_ACCEPT',
  ACCEPTED = 'ACCEPTED',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
  REFUNDED = 'REFUNDED',
}

export interface ITransactionResponse {
  id: string;
  title: string;
  description?: string;
  amount: number; // Converted to number for API response
  currency: string;
  status: TransactionStatus;
  blockchainTxHash?: string;
  paymentId?: string;
  paidAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  buyerId: string;
  sellerId: string;
  buyer?: {
    id: string;
    name: string;
    email: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTransaction {
  sellerId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  buyerId: string;
  status: TransactionStatus;
}

export interface IUpdateTransaction {
  status?: TransactionStatus;
  blockchainTxHash?: string;
  paymentId?: string;
  paidAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
}
