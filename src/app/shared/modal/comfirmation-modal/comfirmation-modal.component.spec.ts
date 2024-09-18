import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmationModalComponent } from './comfirmation-modal.component';

describe('ComfirmationModalComponent', () => {
  let component: ComfirmationModalComponent;
  let fixture: ComponentFixture<ComfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
