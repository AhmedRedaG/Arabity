import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import {
  getMessaging,
  Message,
  MulticastMessage,
} from 'firebase-admin/messaging';
import { Target } from 'src/types/firebase.types';

@Injectable()
export class FirebaseNotificationService {
  private messaging;

  constructor(private configService: ConfigService) {
    let app: App;

    if (getApps().length === 0) {
      app = initializeApp({
        credential: cert({
          projectId: this.configService.get<string>('firebase.projectId'),
          clientEmail: this.configService.get<string>('firebase.clientEmail'),
          privateKey: this.configService
            .get<string>('firebase.privateKey')
            ?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      app = getApps()[0];
    }

    this.messaging = getMessaging(app);
  }

  private createMessage(
    target: Target,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Message | MulticastMessage {
    const baseMessage = {
      notification: { title, body },
      data: data || {},
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          channelId: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    if ('token' in target) {
      return { ...baseMessage, token: target.token };
    } else if ('tokens' in target) {
      return { ...baseMessage, tokens: target.tokens };
    } else {
      return { ...baseMessage, topic: target.topic };
    }
  }

  async sendToDevice(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message = this.createMessage(
      { token: deviceToken },
      title,
      body,
      data,
    );

    const response = await this.messaging.send(message);
    return { success: true, messageId: response };
  }

  async sendToMultipleDevices(
    deviceTokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message = this.createMessage(
      { tokens: deviceTokens },
      title,
      body,
      data,
    );

    const response = await this.messaging.sendEachForMulticast(message);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  }

  async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message = this.createMessage({ topic }, title, body, data);

    const response = await this.messaging.send(message);
    return { success: true, messageId: response };
  }

  async subscribeToTopic(deviceTokens: string[], topic: string) {
    const response = await this.messaging.subscribeToTopic(deviceTokens, topic);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  }

  async unsubscribeFromTopic(deviceTokens: string[], topic: string) {
    const response = await this.messaging.unsubscribeFromTopic(
      deviceTokens,
      topic,
    );

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  }
}
