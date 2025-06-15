import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMyRecommendationsComponent } from './get-my-recommendations.component';

describe('GetMyRecommendationsComponent', () => {
  let component: GetMyRecommendationsComponent;
  let fixture: ComponentFixture<GetMyRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetMyRecommendationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetMyRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
