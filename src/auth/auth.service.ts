import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from 'src/models/user.model';
import { Request } from 'express';

import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import {
  setDoc,
  DocumentReference,
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseservice: FirebaseService) {} //usaremos un servicio de firebase ,

  public greetings(@Req() req: Request) {
    const response = {
      saludo: "Bienvenid@ " + req['user']?.email,
    };
    return response;
  }

  //permitirá a un usuario iniciar sesión en la app. con email y password.
  public async login(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.firebaseservice.auth,
        email,
        password,
      );
      if (userCredential) {
        const id: string = userCredential.user.uid;
        const idToken: string = await userCredential.user.getIdToken(true);
        const docRef: DocumentReference = doc(
          this.firebaseservice.userCollection,
          id,
        );
        const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

        const usuarioLogged: User = {
          ...snap.data(),
          id: snap.id,
          accssesToken: idToken,
        } as User;

        delete usuarioLogged.password;
        return usuarioLogged;
      }
    } catch (error) {
      const firebaseAuthError = error as AuthError;
      console.warn(firebaseAuthError.code);
      if (firebaseAuthError.code === 'auth/wrong-password') {
        throw new HttpException(
          'Email o contraseña incorrecta.',
          HttpStatus.FORBIDDEN,
        );
      }
      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new HttpException(
          'El email no fue encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  public async register(body: Omit<User, 'id'>) {
    //permitirá a un usuario registrarse con email y password.
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          this.firebaseservice.auth,
          body.email,
          body.password,
        );

      if (userCredential) {
        const id: string = userCredential.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseservice.userCollection,
          id,
        );
        await setDoc(docRef, body);
      }
    } catch (error: unknown) {
      const firebaseAuthError = error as AuthError;
      console.log(firebaseAuthError.code);

      if (firebaseAuthError.code === 'auth/email-already-in-use') {
        throw new HttpException(
          'Este Correo ya se encuentra registrado',
          HttpStatus.CONFLICT,
        );
      }
    }
  }
}
