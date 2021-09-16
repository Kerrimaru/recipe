import { Component, Input, OnInit } from '@angular/core';
import { NutritionConst } from '../recipe.model';

@Component({
  selector: 'app-nutrition-table',
  templateUrl: './nutrition-table.component.html',
  styleUrls: ['./nutrition-table.component.scss']
})
export class NutritionTableComponent implements OnInit {

  constructor() { }

  @Input() title = 'Nutrition info';
  @Input() nutritionValues: {name: string, units: string, amount: number}[];
  @Input() editable = false;

  // fields = [
  //   {name: 'Calories', units: 'kcal'},
  //   {name: 'Fat', units: 'g'},
  //   {name: 'Carbs', units: 'g'},
  //   {name: 'Sugar', units: 'g'},
  //   {name: 'Protein', units: 'g'},
  //   {name: 'Fibre', units: 'g'},
  // ]
  // fields = NutritionConst;

  ngOnInit(): void {
    // console.log('fieldnjfs: ', this.fields)
    console.log('already: ', this.nutritionValues)
    // console.log('fieldnjfs: ', this.fields)
  }

}
