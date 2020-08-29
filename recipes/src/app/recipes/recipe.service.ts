import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable, of } from 'rxjs';
// import { DataStorageService } from '../shared/data-storage.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private fb: AngularFireDatabase, public fbAuth: AngularFireAuth) {}

  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  recipeList: Observable<any[]>;

  // init(): Observable<any> {
  //   // return this.fetchRecipes();
  // }

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
    console.log('this.recipes : ', this.recipes);
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    if (!this.recipes) {
      this.recipes = [];
    }
    // this.recipes.push(recipe);
    // this.recipesChanged.next(this.recipes.slice());
    debugger;
    const recipeRef = this.fb.list('recipes');
    console.log('recref: ', recipeRef);
    console.log('re ipe to push: ', recipe);
    recipeRef.push(recipe);
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  fetchRecipes() {
    // debugger;
    // if (this.fbAuth.currentUser) {

    return this.fb
      .list('recipes')
      .valueChanges()
      .pipe(
        map((recipes: Recipe[]) => {
          // this.setRecipes(recipes);
          console.log('recipes ', recipes);
          return recipes;
        }),
        tap((recipes) => {
          console.log('recipes ', recipes);
          this.setRecipes(recipes);
        })
      );

    // this.recipeList.subscribe((res) => {
    //   console.log('fetched recipes res: ', res);
    //   this.setRecipes(res);
    //   return res;
    // });
    // } else {
    //   return of([]);
  }
  // }

  // fetchRecipes() {
  //   // debugger;

  //   this.recipeList = this.fb.list('recipes').valueChanges();
  //   return this.recipeList.subscribe((res) => {
  //     console.log('fetched recipes res: ', res);
  //     this.setRecipes(res);
  //     return res;
  //   });
  // }
}
