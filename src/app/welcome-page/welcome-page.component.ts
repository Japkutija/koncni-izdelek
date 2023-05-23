import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { WeatherService } from '../weather/weather.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  showLogin: boolean = false;
  showSignup: boolean = false;
  signupForm!: FormGroup;

  constructor(private weatherService: WeatherService, private authService: AuthService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'email': new FormControl(null, [Validators.required]),
        'password': new FormControl(null, [Validators.required, Validators.email])
      })
    });
  }
  onSubmit() {
    console.log(this.signupForm);
  }

  onFetchData() {
    this.weatherService.fetchData().subscribe(responseData => {
      console.log(responseData);
    });
  }
  onShowLogin() {
    this.showLogin = true;
    this.showSignup = true;
    this.authService.showLogin.next(this.showLogin);
  }
  onShowSignup() {
    this.showSignup = true;
    this.showLogin = true;
    this.authService.showSignup.next(this.showSignup);
  }

}
