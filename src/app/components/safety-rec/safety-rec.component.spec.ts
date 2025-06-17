import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyRecComponent } from './safety-rec.component';

describe('SafetyRecComponent', () => {
  let component: SafetyRecComponent;
  let fixture: ComponentFixture<SafetyRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyRecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SafetyRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
