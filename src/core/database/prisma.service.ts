import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: Logger = new Logger(PrismaService.name);
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('database connectod');
    } catch (error) {
      this.logger.error(error);
    }
  }
  async onModuleDestroy() {
    try {
        await this.$disconnect();
    } catch (error) {
        this.logger.error(error)
    }
  }
}
