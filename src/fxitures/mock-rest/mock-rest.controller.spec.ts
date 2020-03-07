import { Test, TestingModule } from '@nestjs/testing';
import { MockRestController } from './mock-rest.controller';

describe('MockRest Controller', () => {
  let controller: MockRestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockRestController],
    }).compile();

    controller = module.get<MockRestController>(MockRestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
