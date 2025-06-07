import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailforgetPassComponent } from './emailforget-pass.component';

describe('EmailforgetPassComponent', () => {
  let component: EmailforgetPassComponent;
  let fixture: ComponentFixture<EmailforgetPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailforgetPassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailforgetPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
