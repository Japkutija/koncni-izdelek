import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username: string | null = null;

  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
    // console.log(this.username);
  }

  ngOnInit(): void {
    this.authService.username.subscribe(data => {
      if (data) {
        this.username = data;
      } else {
        this.username = localStorage.getItem('email');
      }
    });
  }
  onLogout() {
    localStorage.removeItem('token');
    this.authService.username.next(null);
    localStorage.removeItem('email');
    this.username = null; //We manually remove the username, because we have to refresh the page to take effect and we don't want that.
    this.router.navigate(['/welcome-page']); //navigate away after Logout
  }

  // getEmail(email: string): void {
  //   this.username = email;
  // }

}
