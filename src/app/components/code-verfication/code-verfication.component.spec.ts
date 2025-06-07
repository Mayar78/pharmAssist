import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeVerficationComponent } from './code-verfication.component';

describe('CodeVerficationComponent', () => {
  let component: CodeVerficationComponent;
  let fixture: ComponentFixture<CodeVerficationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeVerficationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeVerficationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
