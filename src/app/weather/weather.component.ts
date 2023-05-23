import { Component, Input, OnInit } from '@angular/core';
import { CityResponseData } from '../shared/placeholder/city-response-data';
import { WeatherService } from './weather.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  providers: [DatePipe]
})
export class WeatherComponent implements OnInit {
  @Input() data!: CityResponseData;
  forecast = [  //forecast array 
    {
      name: '',
      max_temp: 0,
      min_temp: 0,
      icon: ''
    }
  ];
  currentDate: Date;
  formattedDate: string | null;
  humidityLevel: string = '';
  windLevel: string = '';
  visibility: string = '';
  precipitation: string = '';
  pressure: string = '';
  updatedCityInput: string = '';
  forecast_day = '';
  forecast_days: [] = [];
  next_day_index: number = 1;

  constructor(private weatherService: WeatherService, datePipe: DatePipe) {
    this.currentDate = new Date();
    this.formattedDate = datePipe.transform(this.currentDate, 'EEEE, HH:mm'); //Transform the time into the specific format
  }
  ngOnInit(): void {
    this.weatherService.fetchData() //fetch the City Data
      .subscribe(([currentData, forecastData]) => {
        this.data = currentData //Save the current weather in the property, so we can display it in the template
        this.checkHumidityLevel(this.data.current.humidity);
        this.checkWindLevel(this.data.current.wind_kph);
        this.checkVisibilityLevel(this.data.current.vis_km);
        this.checkPrecipitationLevel(this.data.current.precip_mm);
        this.checkPressure(this.data.current.pressure_mb);
        this.checkForecast(forecastData);
      }
      );
  }

  checkHumidityLevel(humidity_level: number) {
    if (humidity_level >= 0 && humidity_level <= 30) {
      this.humidityLevel = "Dry 🏜️"
    } else if (humidity_level > 30 && humidity_level <= 60) {
      this.humidityLevel = "Comfortable 😊"
    } else if (humidity_level > 60 && humidity_level <= 80) {
      this.humidityLevel = "Humid ☁️"
    } else if (humidity_level > 80 && humidity_level <= 100)
      this.humidityLevel = "Very humid ☔️"
  }
  checkWindLevel(wind_speed: number) {
    if (wind_speed >= 0 && wind_speed <= 8) {
      this.windLevel = "Calm 🍃"
    } else if (wind_speed > 8 && wind_speed <= 24) {
      this.windLevel = "Breezy 🌬️"
    } else if (wind_speed > 24 && wind_speed <= 40) {
      this.windLevel = "Windy 💨"
    } else if (wind_speed > 40)
      this.windLevel = "Very windy 🌪️"
  }
  checkVisibilityLevel(visibility: number) {
    if (visibility >= 0 && visibility <= 1) {
      this.visibility = "Poor visibility 🌫️"
    } else if (visibility > 1 && visibility <= 5) {
      this.visibility = "Fair visibility 🌥️"
    } else if (visibility > 5 && visibility <= 10) {
      this.visibility = "Good visibility ☀️"
    } else if (visibility > 10)
      this.visibility = "Excellent visibility 🌞"
  }
  checkPrecipitationLevel(precipitation: number) {
    if (precipitation === 0) {
      this.precipitation = 'No precipitation 🏜️'
    } else if (precipitation > 0 && precipitation <= 1) {
      this.precipitation = "Light precipitation 🌦️"
    } else if (precipitation > 1 && precipitation <= 5) {
      this.precipitation = "Moderate precipitation 🌧️"
    } else if (precipitation > 5 && precipitation <= 10) {
      this.precipitation = "Heavy precipitation ⛈️"
    } else if (precipitation >= 10)
      this.precipitation = "Very heavy precipitation 🌧️⛈️"
  }
  checkPressure(pressure: number) {
    if (pressure <= 980) {
      this.pressure = "Low pressure ⬇️"
    } else if (pressure > 980 && pressure <= 1010) {
      this.pressure = "Normal pressure ↔️"
    } else if (pressure > 1010 && pressure <= 1030) {
      this.pressure = "High pressure ⬆️"
    } else if (pressure > 1030)
      this.pressure = "Very high pressure ⬆️⬆️"
  }
  retrieveWeatherData() {
    this.weatherService.cityName.next(this.updatedCityInput); //Pass the UPDATED user city input to the service, to the subject.
    // We are subscribed in the ngOnInit, so the values are automatically going to be updated.
  }
  getForecastDays(next_day_index: number): string {
    let dateObj = new Date(); //Get a current date
    let day = dateObj.getDay() + next_day_index; //Get the current day (i.e. Monday = 1)
    let dayName: string; 

    switch (day) {
      case 1:
        dayName = 'Monday';
        break;
      case 2:
        dayName = 'Tuesday';
        break;
      case 3:
        dayName = 'Wednesday';
        break;
      case 4:
        dayName = 'Thursday';
        break;
      case 5:
        dayName = 'Friday';
        break;
      case 6:
        dayName = 'Saturday';
        break;
      case 7:
        dayName = 'Sunday';
        break;
      default:
        dayName = 'Invalid day number';
    }
    return dayName.substring(0, 3); //Return the day name, but only the first three characaters (i.e. Sunday = Sun)
  }

  checkForecast(forecastData: any) {
    this.forecast.length = 1; //Clear out array, so the data gets filled with new information, once the user enters new city name.

    for (let i = 1; i <= 2; i++) {
      this.forecast_day = this.getForecastDays(this.next_day_index); //Get the next day (forecast) name i.e. Monday
      let max_temp = Math.round(forecastData.forecast.forecastday[i].day.maxtemp_c); //Get the next day (forecast) max temp and round it to closest whole number
      let min_temp = Math.round(forecastData.forecast.forecastday[i].day.mintemp_c); //Get the next day (forecast) min temp and round it to closest whole number
      let icon = forecastData.forecast.forecastday[i].day.condition.icon;            //Get the next day (forecast) icon (image)
      this.forecast.push({ name: this.forecast_day, max_temp: max_temp, min_temp: min_temp, icon: icon }); //Save the forecast in the array
      this.next_day_index++;
    }
    this.next_day_index = 1; 
    console.log(forecastData);
  }
}



