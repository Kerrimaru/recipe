import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Nutrition, NutritionConst } from '../recipe.model';

@Component({
  selector: 'app-nutrition-table',
  templateUrl: './nutrition-table.component.html',
  styleUrls: ['./nutrition-table.component.scss'],
})
export class NutritionTableComponent implements OnInit {
  constructor() {}

  @Input() title = 'Nutrition info';
  @Input() nutritionValues: Nutrition[];
  @Input() editable = false;

  @Output() changeEmitter = new EventEmitter<Nutrition[]>();

  // fields = [
  //   { name: 'Calories', units: 'cal' },
  //   { name: 'Fat', units: 'g' },
  //   { name: 'Carbs', units: 'g' },
  //   { name: 'Sugar', units: 'g' },
  //   { name: 'Protein', units: 'g' },
  //   { name: 'Fibre', units: 'g' },
  // ];
  fields = NutritionConst;

  ngOnInit(): void {
    if (!this.nutritionValues) {
      this.nutritionValues = [...NutritionConst];
    }
  }
}
