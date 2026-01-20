export enum TransactionStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
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

export enum OrderCategory {
  ELECTRONICS = 'ELECTRONICS',
  SERVICES = 'SERVICES',
  DIGITAL_GOODS = 'DIGITAL_GOODS',
  PHYSICAL_GOODS = 'PHYSICAL_GOODS',
  OTHER = 'OTHER',
}

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

export type Transaction = any;
export type Order = any;
export type User = any;
export type Notification = any;
