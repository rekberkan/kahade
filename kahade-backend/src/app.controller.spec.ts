import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: 100,
        environment: 'test',
      };

      jest.spyOn(appService, 'getHealth').mockReturnValue(result);

      expect(appController.getHealth()).toBe(result);
    });
  });

  describe('getInfo', () => {
    it('should return API info', () => {
      const result = {
        name: 'Kahade API',
        version: '1.0.0',
        description: 'P2P Escrow Platform Backend API',
        documentation: '/api/v1/docs',
      };

      jest.spyOn(appService, 'getInfo').mockReturnValue(result);

      expect(appController.getInfo()).toBe(result);
    });
  });
});
