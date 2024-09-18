import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkSheetComponent } from './add-work-sheet.component';

describe('AddWorkSheetComponent', () => {
  let component: AddWorkSheetComponent;
  let fixture: ComponentFixture<AddWorkSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
