import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaildoneComponent } from './emaildone.component';

describe('EmaildoneComponent', () => {
  let component: EmaildoneComponent;
  let fixture: ComponentFixture<EmaildoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmaildoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmaildoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
