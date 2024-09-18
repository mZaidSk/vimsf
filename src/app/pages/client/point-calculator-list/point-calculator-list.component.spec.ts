import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointCalculatorListComponent } from './point-calculator-list.component';

describe('PointCalculatorListComponent', () => {
  let component: PointCalculatorListComponent;
  let fixture: ComponentFixture<PointCalculatorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointCalculatorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointCalculatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
