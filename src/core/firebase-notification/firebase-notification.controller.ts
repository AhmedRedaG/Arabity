import { Controller } from '@nestjs/common';
import { FirebaseNotificationService } from './firebase-notification.service';

@Controller('firebase-notification')
export class FirebaseNotificationController {
  constructor(private readonly firebaseNotificationService: FirebaseNotificationService) {}
}
