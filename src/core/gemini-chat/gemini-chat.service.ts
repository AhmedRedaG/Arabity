import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from 'src/types/chat.types';
import { ChatDto } from './dto/chat.dto';
import systemPromptContent from './content/system-prompt.content';

@Injectable()
export class GeminiChatService {
  private ai: GoogleGenAI;
  private systemPromptContent = systemPromptContent;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('gemini.apiKey')!;

    this.ai = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  async chat(dto: ChatDto) {
    const { message, history } = dto;

    if (history && history.length > 0) {
      const validHistory = history?.filter(this.isChatMessage);
      if (validHistory.length !== history.length) {
        throw new BadRequestException('invalid history format');
      }
    }

    const systemPrompt = this.systemPromptContent;
    const fullPrompt =
      history && history.length > 0
        ? this.buildConversationPrompt(systemPrompt, history, message)
        : `${systemPrompt}\n\nCustomer: ${message}\nAssistant:`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: fullPrompt,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      return {
        success: true,
        response: response.text,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  chatStream(dto: ChatDto) {
    const { message, history } = dto;

    const systemPrompt = this.systemPromptContent;
    let fullPrompt: string;

    if (history && history.length > 0) {
      const validHistory = history?.filter(this.isChatMessage);
      if (validHistory.length !== history.length) {
        throw new BadRequestException('invalid history format');
      }
      fullPrompt = this.buildConversationPrompt(systemPrompt, history, message);
    } else {
      fullPrompt = `${systemPrompt}\n\nCustomer: ${message}\nAssistant:`;
    }

    return this.ai.models.generateContentStream({
      model: 'gemini-2.0-flash-exp',
      contents: fullPrompt,
      config: { temperature: 0.7, maxOutputTokens: 1024 },
    });
  }

  async analyzeCarImage(imageData: string, prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageData,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.4,
          maxOutputTokens: 512,
        },
      });

      return {
        success: true,
        response: response.text,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // async countTokens(text: string) {
  //   try {
  //     const result = await this.ai.models.countTokens({
  //       model: 'gemini-2.0-flash-exp',
  //       contents: text,
  //     });

  //     return {
  //       success: true,
  //       totalTokens: result.totalTokens,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error.message,
  //     };
  //   }
  // }

  private isChatMessage(obj: any): obj is ChatMessage {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.role === 'string' &&
      typeof obj.content === 'string'
    );
  }

  private buildConversationPrompt(
    systemPrompt: string,
    history: ChatMessage[],
    newMessage: string,
  ): string {
    let prompt = systemPrompt + '\n\nConversation History:\n';

    history.forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });

    prompt += `Customer: ${newMessage}\nAssistant:`;
    return prompt;
  }

  private handleError(error: any) {
    if (error.message?.includes('RESOURCE_EXHAUSTED')) {
      return {
        success: false,
        response:
          'Our AI assistant is currently busy. Please try again in a moment.',
        error: 'RATE_LIMIT_EXCEEDED',
      };
    }

    if (error.message?.includes('INVALID_ARGUMENT')) {
      return {
        success: false,
        response: 'Sorry, there was an error processing your request.',
        error: 'INVALID_INPUT',
      };
    }

    return {
      success: false,
      response: 'Sorry, an error occurred. Please try again.',
      error: error.message,
    };
  }
}
