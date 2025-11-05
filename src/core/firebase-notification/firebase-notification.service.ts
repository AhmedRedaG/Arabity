import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import {
  getMessaging,
  Message,
  MulticastMessage,
} from 'firebase-admin/messaging';

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

  async sendToDevice(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: Message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high',
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

    const response = await this.messaging.send(message);
    return { success: true, messageId: response };
  }

  async sendToMultipleDevices(
    deviceTokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: MulticastMessage = {
      tokens: deviceTokens,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high',
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
    const message: Message = {
      topic,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high',
      },
    };

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
