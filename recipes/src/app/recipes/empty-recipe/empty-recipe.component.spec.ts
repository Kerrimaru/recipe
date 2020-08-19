import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyRecipeComponent } from './empty-recipe.component';

describe('EmptyRecipeComponent', () => {
  let component: EmptyRecipeComponent;
  let fixture: ComponentFixture<EmptyRecipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyRecipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
