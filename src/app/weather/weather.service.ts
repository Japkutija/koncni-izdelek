import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CityResponseData } from '../shared/placeholder/city-response-data';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  cityName = new BehaviorSubject<string>(''); //entered City name from the user
  private apiUrlCurrent = 'http://api.weatherapi.com/v1/current.json';
  private apiUrlForecast = 'http://api.weatherapi.com/v1/forecast.json';
  days: number = 3;

  constructor(private http: HttpClient) { }

  fetchData() {
    return this.cityName.pipe( //take the value of cityName and create a new observable with the help of SwitchMap.
      switchMap(cityName => {  //We don't need to subscribe in the home-page.component.ts, because we automatically subscribe when creating a new observable with switchMap
        const currentOptions = {
          params: {
            q: cityName,
            key: '967d82687da94f5187165537231404',
          }
        };

        const forecastOptions = {
          params: {
            q: cityName,
            key: '967d82687da94f5187165537231404',
            days: this.days
          }
        };
        const currentRequest = this.http.get<CityResponseData>(this.apiUrlCurrent, currentOptions); 
        const forecastRequest = this.http.get<any>(this.apiUrlForecast, forecastOptions);

        return forkJoin([currentRequest, forecastRequest]); //Merge two API requests into one whole.
      })
    );

  }
}