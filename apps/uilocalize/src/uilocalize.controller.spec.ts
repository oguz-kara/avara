import { Test, TestingModule } from '@nestjs/testing';
import { UilocalizeController } from './uilocalize.controller';
import { UilocalizeService } from './uilocalize.service';

describe('UilocalizeController', () => {
  let uilocalizeController: UilocalizeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UilocalizeController],
      providers: [UilocalizeService],
    }).compile();

    uilocalizeController = app.get<UilocalizeController>(UilocalizeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(uilocalizeController.getHello()).toBe('Hello World!');
    });
  });
});
