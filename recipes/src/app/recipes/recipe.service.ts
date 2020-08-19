import { Recipe } from './recipe.model';
import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Brownies',
  //     'Chili choc vegan brownie',
  //     'http://immigrantstable.com/wp-content/uploads/2014/11/Blog92_Img10.jpg',
  //     [new Ingredient('chocolate', '2 bars'), new Ingredient('chilli', 1)]
  //   ),
  //   new Recipe(
  //     'Broccoli Soup',
  //     'Vegan creamy soup',
  //     'https://assets.epicurious.com/photos/57b3390706de447f4e6d9316/2:1/w_1260%2Ch_630/cream-of-broccoli-soup.jpg',
  //     [{ name: 'broccoli', amount: '1 head' }, new Ingredient('almond milk', '1 cup')]
  //   ),
  // ];

  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    if (!this.recipes) {
      this.recipes = [];
    }
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    if (!this.recipes) {
      this.recipes = [];
    }
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
