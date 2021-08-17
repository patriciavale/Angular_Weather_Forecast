import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TodayForecastComponent } from './home/today-forecast/today-forecast.component';
import { WeeklyForecastComponent } from './home/weekly-forecast/weekly-forecast.component';
import { WeekForecastCardComponent } from './home/week-forecast-card/week-forecast-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TodayForecastComponent,
    WeeklyForecastComponent,
    WeekForecastCardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
