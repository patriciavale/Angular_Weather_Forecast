import { Component, OnInit, Input } from '@angular/core';
import { City } from "../../interfaces/city";
import { Weather } from '../../interfaces/weather';

@Component({
  selector: 'app-week-forecast-card',
  templateUrl: './week-forecast-card.component.html',
  styleUrls: ['./week-forecast-card.component.css']
})
export class WeekForecastCardComponent implements OnInit {
  @Input() weather?: Weather;
  @Input() city?: City;

  constructor() { }

  ngOnInit(): void {
  }

}
