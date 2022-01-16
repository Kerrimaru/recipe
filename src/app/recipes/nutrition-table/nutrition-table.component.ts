import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Nutrition, NutritionConst } from "../recipe.model";

@Component({
  selector: "app-nutrition-table",
  templateUrl: "./nutrition-table.component.html",
  styleUrls: ["./nutrition-table.component.scss"],
})
export class NutritionTableComponent implements OnInit {
  constructor() {}

  @Input() title = "Nutrition info";
  @Input() nutritionValues: Nutrition[];
  @Input() editable = false;

  @Output() changeEmitter = new EventEmitter<Nutrition[]>();

  ngOnInit(): void {
    if (!this.nutritionValues) {
      this.nutritionValues = NutritionConst.map((n) => {
        let val = { ...n, amount: null };
        return val;
      });
    }
  }
}
