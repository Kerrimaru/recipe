import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionTableComponent } from './nutrition-table.component';

describe('NutritionTableComponent', () => {
  let component: NutritionTableComponent;
  let fixture: ComponentFixture<NutritionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
