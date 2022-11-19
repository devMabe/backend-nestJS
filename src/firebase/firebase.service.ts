import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Config } from 'src/models/config.model';
import { Auth, getAuth } from 'firebase/auth';
import {
  CollectionReference,
  Firestore,
  getFirestore,
  collection,
} from 'firebase/firestore';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public userCollection: CollectionReference;
  public firestore: Firestore;

  constructor(private configservice: ConfigService<Config>) {
    // necesitaremos las variables de etorno .env
    this.app = initializeApp({
      apiKey: configservice.get<string>('apiKey'),
      appId: configservice.get<string>('appId'),
      authDomain: configservice.get<string>('authDomain'),
      measurementId: configservice.get<string>('measurementId'),
      messagingSenderId: configservice.get<string>('messagingSenderId'),
      projectId: configservice.get<string>('projectId'),
      storageBucket: configservice.get<string>('storageBucket'),
    });
    
    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
    this._createCollections();
  }

  private _createCollections() {
    this.userCollection = collection(this.firestore, 'users');
  }
}
