import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCalculatorListComponent } from './bank-calculator-list.component';

describe('BankCalculatorListComponent', () => {
  let component: BankCalculatorListComponent;
  let fixture: ComponentFixture<BankCalculatorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCalculatorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCalculatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
