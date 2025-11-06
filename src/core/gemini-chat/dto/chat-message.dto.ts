import { IsEnum, IsString, Length } from 'class-validator';
import { ChatRole } from 'src/types/chat.types';

export class ChatMessageDto {
  @IsEnum(ChatRole)
  role: ChatRole;

  @IsString()
  @Length(1, 1024)
  content: string;
}
