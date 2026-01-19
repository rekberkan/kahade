import { TransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface ITransaction {
  id: string;
  title: string;
  description?: string;
  amount: Decimal;
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
  createdAt: Date;
  updatedAt: Date;
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
