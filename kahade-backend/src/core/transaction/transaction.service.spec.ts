import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { BlockchainService } from '@integrations/blockchain/blockchain.service';
import { PaymentService } from '@integrations/payment/payment.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockTransactionRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByUser: jest.fn(),
    update: jest.fn(),
  };

  const mockBlockchainService = {
    recordTransaction: jest.fn(),
  };

  const mockPaymentService = {
    transferToSeller: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionRepository, useValue: mockTransactionRepository },
        { provide: BlockchainService, useValue: mockBlockchainService },
        { provide: PaymentService, useValue: mockPaymentService },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createDto = {
        sellerId: '2',
        title: 'Test Product',
        amount: 1000,
        currency: 'IDR',
      };

      const transaction = { id: '1', ...createDto, buyerId: '1', status: 'PENDING' };
      mockTransactionRepository.create.mockResolvedValue(transaction);
      mockBlockchainService.recordTransaction.mockResolvedValue({ hash: '0x123' });
      mockTransactionRepository.update.mockResolvedValue({ ...transaction, blockchainTxHash: '0x123' });

      const result = await service.create('1', createDto);

      expect(result).toBeDefined();
      expect(mockTransactionRepository.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return transaction if user is participant', async () => {
      const transaction = {
        id: '1',
        buyerId: '1',
        sellerId: '2',
        status: 'PENDING',
      };

      mockTransactionRepository.findById.mockResolvedValue(transaction);

      const result = await service.findOne('1', '1');

      expect(result).toEqual(transaction);
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not participant', async () => {
      const transaction = {
        id: '1',
        buyerId: '1',
        sellerId: '2',
        status: 'PENDING',
      };

      mockTransactionRepository.findById.mockResolvedValue(transaction);

      await expect(service.findOne('1', '3')).rejects.toThrow(ForbiddenException);
    });
  });
});
