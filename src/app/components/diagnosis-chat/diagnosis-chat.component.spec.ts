import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisChatComponent } from './diagnosis-chat.component';

describe('DiagnosisChatComponent', () => {
  let component: DiagnosisChatComponent;
  let fixture: ComponentFixture<DiagnosisChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosisChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagnosisChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
