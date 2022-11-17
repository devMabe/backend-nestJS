import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from 'src/models/user.model';
import { FirebaseError } from 'firebase/app';

import {
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
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor(private firebaseservice: FirebaseService) {}     //usaremos un servicio de firebase

  //Debe retornar al usuario un saludo ej. 'Hello Word', pero este servicio debe protegido con autenticación, es decir solo debe ser exitoso si el usuario tiene una sesión iniciada, de lo contrario deberá retornar error 401
  public greetings(): string {

    //logica de autentificacion para controlar que solo pueda devolver el mensaje si se ha iniciado sesion correactamente.
    return 'Hello Word!';
  }

  //permitirá a un usuario iniciar sesión en la app. con email y password.
  public async login(email: string,password: string,): Promise<Omit<User, 'password'>> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.firebaseservice.auth,
        email,
        password,
      );
      if (userCredential) {
        const id: string = userCredential.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseservice.userCollection,
          id,
        );
        const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
        const usuarioLogged: User = {
          ...snap.data(),
          id: snap.id,
        } as User;

        delete usuarioLogged.password;
        return usuarioLogged;
      }
    } catch (error) {
      console.log(`[ERROR]: ${error}`);
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
      console.log(`[ERROR]: ${error}`);
    }
  }
}
