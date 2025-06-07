import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecficProductComponent } from './specfic-product.component';

describe('SpecficProductComponent', () => {
  let component: SpecficProductComponent;
  let fixture: ComponentFixture<SpecficProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecficProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecficProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
