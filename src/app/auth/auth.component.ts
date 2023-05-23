import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather/weather.service';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  showLogin: boolean = false;
  showSignup: boolean = false;
  signupForm!: FormGroup;

  constructor(private weatherService: WeatherService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'email': new FormControl(null, [Validators.required]),
        'password': new FormControl(null, [Validators.required, Validators.email])
      })
    });

    let authObs: Observable<AuthResponseData>;

    this.authService.showLogin.subscribe(showLogin => {  //Preveri stanje gumba "login" in ga po potrebi pokaži, če je ta true.
      this.showLogin = showLogin;
    });

    this.authService.showSignup.subscribe(showSignup => { //Preveri stanje gumba "signup" in ga po potrebi pokaži, če je ta true.
      this.showSignup = showSignup;
    })


  }
  onSubmit() {

    let authObs: Observable<AuthResponseData>;

    const email = this.signupForm.value.userData.email;  //pridobi podatke iz formsov, v tem primeru value emaila iz objekta userData 
    const password = this.signupForm.value.userData.password;  //pridobi podatke iz formsov, v tem primeru value passworda iz objekta userData 

    // authObs = this.authService.signup(email, password);   //kliči API v authservice in se poskusi prijavit

    // authObs.subscribe(resData => {                            //pridobi povratne informacije od API-ja
    //   console.log('The SUBSCRIBEd DATA IS: ' + resData);
    // })

    if (this.showLogin) {
      authObs = this.authService.login(email, password);

    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(resData => {
      localStorage.setItem('token', resData.localId); //shrani token, torej id uporabnika v local storage
      this.router.navigate(["/home-page"]);
      
    });

    // this.signupForm.reset();
  }

  onFetchData() {
    this.weatherService.fetchData().subscribe(responseData => {
      console.log(responseData);
    });
  }
  onShowLogin() {
    this.showLogin = true;
  }
  switchToLogin() {
    this.showLogin = true;
    this.showSignup = false;
  }
  switchToSignup() {
    this.showLogin = false;
    this.showSignup = true;
  }
}
