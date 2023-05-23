import { Component } from '@angular/core';
import { WeatherService } from '../weather/weather.service';
import { CityResponseData } from '../shared/placeholder/city-response-data';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  public data!: CityResponseData;
  cityInput: string = ''; //user city input
  constructor(public weatherService: WeatherService) {

  }
  getWeatherData() {
    this.weatherService.cityName.next(this.cityInput); //Pass the user city input to the service, to the subject.
    // this.weatherService.fetchData() //fetch the City Data
    //   .subscribe(cityData => {
    //   },
    //     error => {
    //       console.log('An error occured: ', error);
    //     }
    //   );
  }
}
