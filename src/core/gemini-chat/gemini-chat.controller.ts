import {
  Controller,
  Post,
  Body,
  UseGuards,
  Sse,
  MessageEvent,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, from, map } from 'rxjs';
import { GeminiChatService } from './gemini-chat.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { ChatDto } from './dto/chat.dto';
import { AnalyzeImageDto } from './dto/analyze-image.dto';

@UseGuards(AuthGuard)
@Controller('chat')
export class GeminiChatController {
  constructor(private readonly geminiService: GeminiChatService) {}

  @Post()
  chat(@Body() dto: ChatDto) {
    return this.geminiService.chat(dto);
  }

  @Sse('stream')
  async streamChat(@Query() dto: ChatDto): Promise<Observable<MessageEvent>> {
    return from(this.geminiService.chatStream(dto)).pipe(
      map((stream) => {
        return {
          data: { chunk: stream },
        } as MessageEvent;
      }),
    );
  }

  @Post('analyze-image')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AnalyzeImageDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    const base64Image = file.buffer.toString('base64') as string;
    return await this.geminiService.analyzeCarImage(base64Image, dto.prompt);
  }
}
