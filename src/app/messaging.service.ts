import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject<any>(null);

  constructor(private afMessaging: AngularFireMessaging) {
    this.afMessaging.messages.subscribe((msg) => {
      this.currentMessage.next(msg);
    });
  }

  requestPermission() {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        console.log('Notification permission granted. Token:', token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
}
