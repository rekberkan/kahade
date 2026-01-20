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
  FIFTY_FIFTY = 'FIFTY_FIFTY',
}

export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
  USDT = 'USDT',
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

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export type Transaction = any;
export type Order = any;
export type User = any;
export type Notification = any;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum NotificationType {
  TRANSACTION = 'TRANSACTION',
  DISPUTE = 'DISPUTE',
  PAYMENT = 'PAYMENT',
  SYSTEM = 'SYSTEM',
}

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_UPDATED = 'TRANSACTION_UPDATED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
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

export interface ITransactionResponse extends IOrderResponse {}
