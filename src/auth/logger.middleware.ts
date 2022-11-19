import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './firebaseServiceAccount.json';

const firebase_params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateIdKey: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  ClientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderx509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CerUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private defaultApp: any;
  constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
      databaseURL: "https://nestjsdb-e9c3f-default-rtdb.firebaseio.com"
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token !== null && token !== '') {
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          const user = {
            email: decodedToken.email,
          };

          req['user'] = user;
          next();
        })
        .catch((error) => {
          console.error(error);
          this.accessDenied(req.url, res);
        });
    } else {
      next();
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(401).json({
      statusCode: 401,
      timeStamp: new Date().toISOString,
      path: url,
      message: 'Asegurate de tener una sesión iniciada',
    });
  }
}
