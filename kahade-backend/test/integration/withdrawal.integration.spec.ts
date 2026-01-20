import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { WithdrawalGuardService } from '@core/withdrawal/withdrawal-guard.service';

describe('Withdrawal Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let withdrawalGuard: WithdrawalGuardService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        WithdrawalGuardService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    withdrawalGuard = moduleFixture.get<WithdrawalGuardService>(
      WithdrawalGuardService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Withdrawal Limits', () => {
    it('should enforce daily withdrawal limit', async () => {
      const userId = 'test-user-1';
      const dailyLimit = BigInt(50_000_000 * 100); // 50M IDR

      // First withdrawal (within limit)
      const check1 = await withdrawalGuard.checkWithdrawalLimits(
        userId,
        BigInt(30_000_000 * 100), // 30M IDR
      );

      expect(check1.canWithdraw).toBe(true);

      // Record withdrawal
      await withdrawalGuard.recordWithdrawal(
        userId,
        BigInt(30_000_000 * 100),
        '127.0.0.1',
      );

      // Second withdrawal (exceeds limit)
      const check2 = await withdrawalGuard.checkWithdrawalLimits(
        userId,
        BigInt(25_000_000 * 100), // Would total 55M
      );

      expect(check2.canWithdraw).toBe(false);
      expect(check2.reason).toContain('Daily withdrawal limit exceeded');
    });

    it('should enforce cooling period', async () => {
      const userId = 'test-user-2';

      // First withdrawal
      await withdrawalGuard.recordWithdrawal(
        userId,
        BigInt(1_000_000 * 100),
        '127.0.0.1',
      );

      // Immediate second withdrawal (within cooling period)
      const check = await withdrawalGuard.checkWithdrawalLimits(
        userId,
        BigInt(1_000_000 * 100),
      );

      expect(check.canWithdraw).toBe(false);
      expect(check.reason).toContain('Cooling period active');
    });

    it('should calculate velocity score correctly', async () => {
      const userId = 'test-user-3';

      // Make 3 withdrawals in quick succession
      for (let i = 0; i < 3; i++) {
        await withdrawalGuard.recordWithdrawal(
          userId,
          BigInt(1_000_000 * 100),
          '127.0.0.1',
        );
      }

      const check = await withdrawalGuard.checkWithdrawalLimits(
        userId,
        BigInt(1_000_000 * 100),
      );

      // Velocity score should be elevated
      expect(check.velocityScore).toBeGreaterThan(0);
    });
  });
});