import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { City } from "../../interfaces/city";
import { Weather } from '../../interfaces/weather';
import * as L from 'leaflet';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-weekly-forecast',
  templateUrl: './weekly-forecast.component.html',
  styleUrls: ['./weekly-forecast.component.css']
})
export class WeeklyForecastComponent implements OnInit {
  @Input() weekweather?: Weather[];
  @Input() hourweather?: Weather[];
  @Input() city?: City;
  // map
  map: any;
  mapIsDone: boolean = false;
  // chart
  public lineChartData: ChartDataSets[] = [{data: []}];
  public lineChartLabels: Label[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartColors: Color[] = [{
    backgroundColor: '#bdbdbd80',
    borderColor: '#bdbdbd',
    pointBackgroundColor: '#bdbdbd',
    pointBorderColor: '#bdbdbd',
    pointHoverBackgroundColor: '#1a1a1a',
    pointHoverBorderColor: '#1a1a1a'
  }];
  public lineChartLegend = true;
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  }
  chartIsDone: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Builds the map with world map and temperature tiles
   */
  setMap() {
    if(this.city) {
      this.map = L.map('mapid').setView([parseFloat(this.city.coord.lat), parseFloat(this.city.coord.lon)], 5);
      // lay tiles of world map
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicGF0cmljaWF2YWxlIiwiYSI6ImNrbmRkMDdraTJhODMyd282ODhxYXlzZ2IifQ.9C9XkHLZhiz3ebp-aN7OWw'
      }).addTo(this.map);
      // lay tiles of temperature
      L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid={accessToken}', {
        attribution: 'Temperature © <a href="https://openweathermap.org/">OpenWeatherMap</a>',
        maxZoom: 10,
        accessToken: '5f3c56b603112be8b0eb71fd23668078',
      }).addTo(this.map);
    }
  }

  /**
   * Updates the coordinates and zoom of the map when the city changes
   */
  updateMapCoord() {
    if(this.city) {
      this.map.setView([parseFloat(this.city.coord.lat), parseFloat(this.city.coord.lon)], 5);
    }
  }

  /**
   * Builds the chart with hourly forecast
   */
  updateChart() {
    if(this.hourweather) {
      // organize received hourly weather in arrays
      let degreeChart: any = [];
      let hourChart: any = [];
    
      this.hourweather.forEach(element => {
        hourChart.push(element.time+":00");
        degreeChart.push(parseInt(element.degrees));
      });

      this.lineChartLabels = hourChart;
      this.lineChartData = [{ data: degreeChart, label: 'Temperature' }];
    }
  }

  /**
   * When a change is detected, generate and update map
   * @param changes the occurred changes
   */
  ngOnChanges(changes: SimpleChanges) {
    // checks if city has been chosen and if weather has been loaded
    if(!this.mapIsDone && this.city && changes.weekweather && changes.weekweather.currentValue.length > 0) {
      this.mapIsDone = true;
      // build map
      this.setMap();
    }
    // checks if city has been changed and updates maps coordinates
    if(this.city && changes.city && changes.city.previousValue != undefined && changes.city.previousValue != changes.city.currentValue) {
      this.updateMapCoord();
    }

    // checks if weather has been received
    if(!this.chartIsDone && changes.hourweather && changes.hourweather.currentValue.length > 0) {
      this.chartIsDone = true;
      this.updateChart();
    }
    
    // small function to check if two arrays are equal (assumes same length)
    const equals = (a: any, b: any) => a.every((v: any, i: any) => v === b[i]);

    // checks if it has received new hourly weather and updates chart
    if(changes.hourweather && changes.hourweather.previousValue != undefined && changes.hourweather.currentValue != undefined && !equals(changes.hourweather.previousValue, changes.hourweather.currentValue)) {
      this.updateChart();
    }
  }

}
