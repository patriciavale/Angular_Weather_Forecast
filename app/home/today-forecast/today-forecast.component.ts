import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { City } from "../../interfaces/city";
import { Weather } from "../../interfaces/weather";
import cityData from '../../../assets/city.list.min.json';

@Component({
  selector: 'app-today-forecast',
  templateUrl: './today-forecast.component.html',
  styleUrls: ['./today-forecast.component.css']
})
export class TodayForecastComponent implements OnInit {
  @Input() weather?: Weather;
  @Input() error?: string;
  @Input() degrees?: string;
  @Output() newCity = new EventEmitter<City>();

  showFilter: boolean = false;
  filteredCities: City[] = [];
  cities = JSON.parse(JSON.stringify(cityData));

  /**
   * When the user clicks on a filtered city in search, share the city
   * @param city the city that was clicked
   */
  onClick(city: City): void {
    if(city) {
      this.newCity.emit(city);
      this.showFilter = false;
    }
  }

  /**
   * Filters a city in the json of cities and returns an object with the city.
   * @param city the value to filter
   */
   private filterCity(city: string): any {
    return this.cities.filter((obj: any) => {return obj['name'].toUpperCase().indexOf(city.toUpperCase()) > -1});
  }

  /**
   * When something is typed in the input, show filtered cities
   * @param value the value of the input at the time
   */
  onChange(value: string): void {
    this.filteredCities = [];
    if(!value) this.showFilter = false;
    else {
      this.showFilter = true;
      let filtered = this.filterCity(value).sort((a: City, b: City) => {
        if(a.name.length > b.name.length) return 1;
        else return -1
      });
      if(filtered) {
        // only show 50 filtered items max
        for(let i = 0; i < 50 && i < filtered.length; i++) {
          let temp : City = {
            name: filtered[i].name,
            country: filtered[i].country,
            coord: {
              lat: filtered[i].coord.lat,
              lon: filtered[i].coord.lon
            }
          };
          this.filteredCities.push(temp);
        }
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
