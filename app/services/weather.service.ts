import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { City } from "../interfaces/city";
import { Weather } from '../interfaces/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
  private appId = '5f3c56b603112be8b0eb71fd23668078';
  weather: Weather[] = [];

  constructor(private http: HttpClient) { }

  /**
   * Gets the day of the week correspondent to the unix timestamp
   * @param unix the timestamp to translate
   * @returns the day of the week
   */
  private getUnixDayOfWeek(unix: number) {
    let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    return weekday[(new Date(unix*1000)).getDay()];
  }

  /**
   * Gets the hour correspondent to the unix timestamp
   * @param unix the timestamp to translate
   * @returns the hour
   */
  private getUnixHour(unix: number) {
    return (new Date(unix*1000)).getHours();
  }

  /**
   * Handle Http operation that failed.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
      return throwError(error);
    };
  }
  
  /**
   * Get weather from API
   * @param city the city to get the forecast from
   * @param degrees the degrees system (metric [default]/imperial) 
   * @returns array of received weather (current and 5-day forecast)
   */
  getWeather(city: City, degrees: string): Observable<Weather[]> {
    if(city) {
      let cityCoord = city.coord;
      return this.http
        //get<any> might be a security issue and is too general, but for now it works (solution: define interface with parameters that are needed from response)
        .get<any>(this.weatherUrl + 'lat=' + cityCoord.lat + '&lon=' + cityCoord.lon + '&exclude=minutely,alerts&appid=' + this.appId + "&units=" + degrees)
        .pipe(
          map(res => {
            // console.log(res);
            // clears previous weather data
            this.weather = [];

            // current forecast
            this.weather.push({
              name: String(res["current"].weather[0].main),
              degrees: String(parseInt(res["current"].temp)),
              max: "",
              min: "",
              precipitation: String(res["daily"][0].pop*100),
              description: String(res["current"].weather[0].description),
              icon: String(res["current"].weather[0].icon),
              day: String(this.getUnixDayOfWeek(res["current"].dt+res.timezone_offset-3600)),
              time: String(this.getUnixHour(res["current"].dt+res.timezone_offset-3600))
            });

            // 5 day forecast
            for(let i = 0; i < 5; i++) {
              this.weather.push({
                name: String(res["daily"][i].weather[0].main),
                degrees: "",
                max: String(parseInt(res["daily"][i].temp.max)),
                min: String(parseInt(res["daily"][i].temp.min)),
                precipitation: "",
                description: "",
                icon: String(res["daily"][i].weather[0].icon),
                day: String(this.getUnixDayOfWeek(res["daily"][i].dt+res.timezone_offset-3600)).substring(0,3),
                time: ""
              })
            }

            // hourly forecast of next 48 hours
            for(let i = 0; i < 48; i++) {
              this.weather.push({
                name: "",
                degrees: String(parseInt(res["hourly"][i].temp)),
                max: "",
                min: "",
                precipitation: "",
                description: "",
                icon: "",
                day: "",
                time: String(this.getUnixHour(res["hourly"][i].dt+res.timezone_offset-3600))
              })
            }
            
            return this.weather;
          }),
          catchError(this.handleError<Weather[]>('getWeather', []))
        )
    }
    else {
      return this.http.get<any>("").pipe(catchError(this.handleError<Weather[]>('getWeather', [])));
    }
  }
}
