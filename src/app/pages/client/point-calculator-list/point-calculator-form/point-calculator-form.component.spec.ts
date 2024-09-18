import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointCalculatorFormComponent } from './point-calculator-form.component';

describe('PointCalculatorFormComponent', () => {
  let component: PointCalculatorFormComponent;
  let fixture: ComponentFixture<PointCalculatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointCalculatorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointCalculatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
