import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  showLogin = new Subject<boolean>();
  showSignup = new Subject<boolean>();
  user = new BehaviorSubject<User>(null!);
  username = new BehaviorSubject<string | null>(null);
  
  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDpliq3UEZp3kqFhVcwJN6g98wypQslrqE',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }

    );

  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDpliq3UEZp3kqFhVcwJN6g98wypQslrqE',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(tap(userData => {
      this.handleAuthentication(userData.email, userData.localId, +userData.expiresIn);
      localStorage.setItem('email', userData.email);
      this.username.next(userData.email);
    }));
  }

  private handleAuthentication(email: string, localId: string, expiresIn: number) {
    const user = new User(email, localId, expiresIn);
    this.user.next(user);
  }
}
