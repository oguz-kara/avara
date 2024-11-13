import { Module } from '@nestjs/common';
import { UilocalizeController } from './uilocalize.controller';
import { UilocalizeService } from './uilocalize.service';

@Module({
  imports: [],
  controllers: [UilocalizeController],
  providers: [UilocalizeService],
})
export class UilocalizeModule {}
