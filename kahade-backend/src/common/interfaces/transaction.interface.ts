export enum OrderStatus {
  PENDING_ACCEPT = 'PENDING_ACCEPT',
  ACCEPTED = 'ACCEPTED',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
  REFUNDED = 'REFUNDED',
}

export enum InitiatorRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

export enum OrderCategory {
  ELECTRONICS = 'ELECTRONICS',
  SERVICES = 'SERVICES',
  DIGITAL_GOODS = 'DIGITAL_GOODS',
  PHYSICAL_GOODS = 'PHYSICAL_GOODS',
  OTHER = 'OTHER',
}

export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
  USDT = 'USDT',
}

export enum FeePayer {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  FIFTY_FIFTY = 'FIFTY_FIFTY',
}

export interface IOrder {
  id: string;
  orderNumber: string;
  initiatorId: string;
  counterpartyId?: string;
  initiatorRole: InitiatorRole;
  title: string;
  description: string;
  category: OrderCategory;
  currency: Currency;
  amountMinor: bigint;
  feePayer: FeePayer;
  platformFeeMinor: bigint;
  holdingPeriodDays: number;
  customTerms?: string;
  status: OrderStatus;
  inviteToken: string;
  inviteExpiresAt: Date;
  acceptedAt?: Date;
  paidAt?: Date;
  autoReleaseAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  deletedAt?: Date;
  deletedByUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface ITransactionResponse extends IOrderResponse {
  buyer?: any;
  seller?: any;
  blockchainTxHash?: string;
}

export interface ICreateTransaction {
  title: string;
  description: string;
  category: OrderCategory;
  amount: number;
  currency: Currency;
  buyerId: string;
  sellerId?: string;
  status: OrderStatus;
}

export interface IUpdateTransaction {
  status?: OrderStatus;
  blockchainTxHash?: string;
  paidAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}
