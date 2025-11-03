import { Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseNotificationService {
  private firebaseApp;
  private messaging;

  constructor() {
    this.firebaseApp = initializeApp();
    this.messaging = getMessaging(this.firebaseApp);
  }
}
