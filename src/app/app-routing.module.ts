import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full'},
  { path: 'home-page', component: HomePageComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path: 'welcome-page', component: WelcomePageComponent},
  { path: 'weather-page', component: WeatherComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
