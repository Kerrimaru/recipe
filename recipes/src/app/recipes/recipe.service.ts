import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable, of } from 'rxjs';
// import { DataStorageService } from '../shared/data-storage.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private fb: AngularFireDatabase, public fbAuth: AngularFireAuth) {}

  recipesChanged = new Subject<Recipe[]>();

  private recipes: any[] = [];
  // recipeList: Observable<any[]>;
  recipeList: AngularFireList<Recipe>;

  recTest: Observable<any[]>;
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
    return this.recipes[index];
  }

  getRecipeSub(index: number) {
    return this.recTest.pipe(map((r) => r[index]));
  }

  addRecipe(recipe: Recipe) {
    console.log('new recipe created: ', recipe);
    if (!this.recipes) {
      this.recipes = [];
    }
    this.recipeList.push(recipe);
    // this.recipes.push(recipe);
    // this.setRecipes(this.recipes);
  }

  updateRecipe(recipe: Recipe, key: string) {
    console.log('recip: ', recipe, ' key: ', key);
    this.recipeList.update(key, { ...recipe });
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  // fetchRecipes() {
  //   return this.fb
  //     .list('recipes')
  //     .valueChanges()
  //     .pipe(
  //       map((recipes: Recipe[]) => {
  //         this.setRecipes(recipes);
  //         console.log('recipes ', recipes);
  //         return recipes;
  //       })
  //       // tap((recipes) => {
  //       //   console.log('recipes ', recipes);
  //       //   this.setRecipes(recipes);
  //       // })
  //     );
  // }

  toggleFavourite(key: string, favourite: boolean) {
    this.recipeList.update(key, { favourite: !favourite });
  }

  fetchRecipes() {
    this.recipeList = this.fb.list('recipes');
    return (this.recTest = this.recipeList.snapshotChanges().pipe(
      map((changes) => changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))),
      tap((rec) => {
        console.log('%c recipes! ', 'background: #222; color: #bada55', rec);
        this.setRecipes(rec);
      })
    ));
    // return this.fb
    //   .list('recipes')
    //   .valueChanges()
    //   .pipe(
    //     map((recipes: Recipe[]) => {
    //       this.setRecipes(recipes);
    //       console.log('recipes ', recipes);
    //       console.log('res test: ', this.recTest);
    //       return recipes;
    //     }),
    //     switchMap((res) => {
    //       return this.recTest;
    //     }),
    //     tap((recipes) => {
    //       console.log('%c recipes! ', 'background: #222; color: #bada55', recipes);
    //     })
    //   );
  }
}
