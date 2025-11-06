import { Module } from '@nestjs/common';
import { GeminiChatService } from './gemini-chat.service';
import { GeminiChatController } from './gemini-chat.controller';

@Module({
  controllers: [GeminiChatController],
  providers: [GeminiChatService],
})
export class GeminiChatModule {}
