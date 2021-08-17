import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekForecastCardComponent } from './week-forecast-card.component';

describe('WeekForecastCardComponent', () => {
  let component: WeekForecastCardComponent;
  let fixture: ComponentFixture<WeekForecastCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekForecastCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekForecastCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
