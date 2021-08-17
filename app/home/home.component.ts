import { Component, OnInit } from '@angular/core';
import { City } from "../interfaces/city";
import { Weather } from '../interfaces/weather';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weather: Weather[] = [];
  city!: City;
  error: string = "";
  degrees: string = "metric";

  constructor(private weatherService: WeatherService) { }

  /**
   * Subscribe to get weather service. Receives error
   */
  getWeather(): void {
    this.weatherService.getWeather(this.city, this.degrees)
        .subscribe(
          weather => {
            if(weather && weather.length > 0) {
              // console.log("Weather received: ", weather);
              this.weather = weather;
            }
          },
          error => {
            this.error = "[code "+error.error.cod+"] Message: " + error.error.message;
          });
  }

  /**
   * Get city from search and get weather from API according to city
   * @param city - city that was chosen
   */
  getCity(city : City) {
    if(city) {
      this.city = city;
      this.getWeather();
    }
  }

  /**
   * Updates degrees system depending on the clicked one. Fetches new data from API if city has been selected
   * @param degrees the degree system (metric [default]/imperial)
   */
  updateDegrees(degrees: string) {
    if(degrees) {
      this.degrees = degrees;
      if(this.city) {
        this.getWeather();
      }
    }
  }

  ngOnInit(): void {
  }

}
