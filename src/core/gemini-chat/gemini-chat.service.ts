import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from 'src/types/chat.types';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class GeminiChatService {
  private ai: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('gemini.apiKey')!;

    this.ai = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  async chat(dto: ChatDto) {
    const { message, history } = dto;

    try {
      const systemPrompt = this.buildSystemPrompt();
      const fullPrompt =
        history && history.length > 0
          ? this.buildConversationPrompt(systemPrompt, history, message)
          : `${systemPrompt}\n\nCustomer: ${message}\nAssistant:`;

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

  async chatStream(dto: ChatDto) {
    const { message, history } = dto;

    const systemPrompt = this.buildSystemPrompt();
    const fullPrompt =
      history && history.length > 0
        ? this.buildConversationPrompt(systemPrompt, history, message)
        : `${systemPrompt}\n\nCustomer: ${message}\nAssistant:`;

    const stream = await this.ai.models.generateContentStream({
      model: 'gemini-2.0-flash-exp',
      contents: fullPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    return stream;
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

  private buildSystemPrompt(): string {
    return `You are a helpful customer service assistant for Arabity, a premium car service booking platform in Cairo, Egypt.

Your capabilities:
- Help customers in book car services instructions
- Provide information about available services
- Answer questions about pricing and service duration
- Provide general automotive advice
- Analyze images and suggest prober service

Services we offer:
1. Oil Change: Starting from 150 EGP, takes 30 minutes
2. Tire Rotation: 100 EGP, takes 45 minutes
3. Brake Service: Starting from 500 EGP, takes 1-2 hours
4. Full Car Inspection: 200 EGP, takes 1 hour
5. AC Maintenance: Starting from 300 EGP, takes 45 minutes

Booking Instructions:
1. Select prober service depends on your needs
2. Select the car that you want service to applied to, if you have not one yet you can add a new one
3. Select the address if you want us to visit you or you can visit us on aur center
4. Choose time you comfortable with to complete the service, At lese an hour from now 
5. If the service needs a components choose prober ones and continue
6. Choose you preferred payment method, if its fail you can choose another one or try again later
7. Congratulation! your booking now is confirmed and we will contact you
8. You can simple rebook your older booking again any time you want

Business Information:
- Hours: All week days, 6 AM - 11 PM
- Location: Cairo, Egypt
- Payment: Cash and Online Payments accepted
- Warranty: All services include 30-day warranty

Guidelines:
- Always be polite, professional, and helpful
- Speak in English or Arabic based on customer preference
- If you don't know specific information, guide customer to contact support at +201014821864
- Suggest relevant services based on customer needs`;
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
