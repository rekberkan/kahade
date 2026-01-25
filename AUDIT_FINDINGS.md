# KAHADE - Audit Findings Report

## Summary of Issues Found

### 1. Prisma Schema Conflict (CRITICAL)
**Location:** `kahade-backend/prisma/`
**Issue:** Dua schema Prisma ditemukan - `schema.prisma` dan folder `schema/`
**Impact:** Prisma generate gagal, aplikasi tidak bisa dijalankan
**Fix:** Hapus `schema.prisma` karena menggunakan prismaSchemaFolder feature

### 2. Enum Mismatch - prisma-types.shim vs Prisma Generated (CRITICAL)
**Location:** `kahade-backend/src/common/shims/prisma-types.shim.ts`
**Issue:** Enum di shim file tidak sinkron dengan Prisma schema

#### 2.1 EscrowHoldStatus Mismatch
- **Shim:** ACTIVE, HELD, RELEASED, REFUNDED, DISPUTED, ADJUSTED
- **Prisma:** ACTIVE, RELEASED, REFUNDED, DISPUTED, ADJUSTED
- **Missing in Prisma:** HELD

#### 2.2 DisputeStatus Mismatch
- **Shim:** OPEN, RESPONDED, UNDER_REVIEW, UNDER_ARBITRATION, AWAITING_RESPONSE, DECIDED, APPEALED, RESOLVED, CLOSED, ESCALATED
- **Prisma:** OPEN, RESPONDED, ESCALATED, UNDER_ARBITRATION, DECIDED, APPEALED, CLOSED
- **Missing in Prisma:** UNDER_REVIEW, AWAITING_RESPONSE, RESOLVED

#### 2.3 JournalType Mismatch
- **Shim:** DEPOSIT, WITHDRAWAL, ESCROW_LOCK, ESCROW_RELEASE, TRANSFER, FEE, REFUND, ADJUSTMENT
- **Prisma:** TRANSACTION, ADJUSTMENT
- **Severe mismatch** - Shim has many more values

#### 2.4 DisputeDecision Mismatch
- **Shim:** PENDING, BUYER_WINS, SELLER_WINS, SPLIT, CANCELLED, RELEASE_ALL_TO_SELLER, REFUND_ALL_TO_BUYER, SPLIT_SETTLEMENT, CANCEL_VOID
- **Prisma:** NONE, RELEASE_ALL_TO_SELLER, REFUND_ALL_TO_BUYER, SPLIT_SETTLEMENT, CANCEL_VOID
- **Missing in Prisma:** PENDING, BUYER_WINS, SELLER_WINS, SPLIT, CANCELLED

### 3. TypeScript Type Errors (24+ errors)

#### 3.1 Webhook Controllers
- `midtrans.webhook.controller.ts` (lines 424, 434)
- `xendit.webhook.controller.ts` (lines 424, 434)
- PaymentStatus type mismatch

#### 3.2 Admin Controller
- `admin.controller.ts` (lines 155, 191, 326)
- Missing properties: 'name', 'kycDocuments', 'kycRejectionReason'

#### 3.3 Dispute Repository/Service
- `dispute.repository.ts` (lines 118, 127, 181, 228)
- `dispute.service.ts` (line 299)
- DisputeStatus and DisputeDecision type mismatches

#### 3.4 Escrow Service
- `escrow.service.ts` (lines 331, 443, 532, 589, 680)
- EscrowHoldStatus type mismatch

#### 3.5 Ledger Service
- `ledger.service.ts` (lines 120, 138, 143, 158)
- JournalType mismatch and missing 'entries' property

#### 3.6 User Repository
- `user.repository.ts` (line 49)
- Username required but optional in code

#### 3.7 Wallet Service
- `wallet.service.ts` (lines 148-152, 256)
- Null check missing for wallet

#### 3.8 Withdrawal Service
- `withdrawal.service.ts` (lines 201, 212, 369)
- KYCStatus type mismatch

### 4. Dependency Version Conflict (HIGH)
**Location:** `kahade-backend/package.json`
**Issue:** @nestjs/swagger@11.2.5 requires @nestjs/common@^11.0.1 but project uses @nestjs/common@^10.3.0
**Impact:** npm install fails without --legacy-peer-deps

## Files to Fix

1. `prisma/schema/00_base.prisma` - Add missing enum values
2. `src/common/shims/prisma-types.shim.ts` - Sync with Prisma schema
3. `src/core/escrow/escrow.service.ts` - Fix type imports
4. `src/core/dispute/dispute.repository.ts` - Fix type imports
5. `src/core/dispute/dispute.service.ts` - Fix type imports
6. `src/core/ledger/ledger.service.ts` - Fix type imports and include entries
7. `src/core/wallet/wallet.service.ts` - Add null checks
8. `src/core/withdrawal/withdrawal.service.ts` - Fix type imports
9. `src/core/user/user.repository.ts` - Fix username handling
10. `src/core/admin/admin.controller.ts` - Fix property access
11. `src/api/webhooks/midtrans.webhook.controller.ts` - Fix PaymentStatus
12. `src/api/webhooks/xendit.webhook.controller.ts` - Fix PaymentStatus
13. `package.json` - Fix @nestjs/swagger version
