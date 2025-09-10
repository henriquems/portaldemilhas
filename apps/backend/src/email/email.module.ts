import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ProvedorEmail } from '@portaldemilhas/core';

@Module({
  providers: [
    {
      provide: ProvedorEmail,
      useClass: EmailService,
    },
  ],
  exports: [ProvedorEmail],
})
export class EmailModule {}