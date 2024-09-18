import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCalculatorFormComponent } from './bank-calculator-form.component';

describe('BankCalculatorFormComponent', () => {
  let component: BankCalculatorFormComponent;
  let fixture: ComponentFixture<BankCalculatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCalculatorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCalculatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
