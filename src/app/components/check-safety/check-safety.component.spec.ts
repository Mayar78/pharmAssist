import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSafetyComponent } from './check-safety.component';

describe('CheckSafetyComponent', () => {
  let component: CheckSafetyComponent;
  let fixture: ComponentFixture<CheckSafetyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckSafetyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
