import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shipping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  ingredientEditorSub: Subscription;
  editMode = false;
  selectedIngredientIndex: number;
  editIngName: string;
  editIngAmount: string;
  selectedIngredient: Ingredient;

  @ViewChild('f', { static: false }) ingredientForm: NgForm;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredientEditorSub = this.shoppingListService.ingredientSelected.subscribe((index) => {
      this.editMode = true;
      this.selectedIngredientIndex = index;
      this.selectedIngredient = this.shoppingListService.getIngredient(index);
      this.ingredientForm.setValue({
        name: this.selectedIngredient.name,
        amount: this.selectedIngredient.amount,
      });
    });
  }

  ngOnDestroy() {
    this.ingredientEditorSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    this.editMode
      ? this.shoppingListService.updateIngredient(this.selectedIngredientIndex, ingredient)
      : this.shoppingListService.addIngredient(ingredient);
    // form.reset();
    // this.editMode = false;
    this.onClear();
  }

  onClear() {
    this.ingredientForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.selectedIngredientIndex);
    this.onClear();
  }
}
