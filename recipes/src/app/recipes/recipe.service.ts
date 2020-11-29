import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
// import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
// import { DataStorageService } from '../shared/data-storage.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private fb: AngularFireDatabase) {}

  private recipes: any[] = [];
  recipeList: AngularFireList<Recipe>;

  recipes$: Observable<Recipe[]>;
  recipeBehaveSubj = new BehaviorSubject<Recipe[]>([]);
  // recipesChanged = new Subject<Recipe[]>();

  // setRecipes(recipes: Recipe[]) {
  //   this.recipes = recipes;
  //   if (!this.recipes) {
  //     this.recipes = [];
  //   }
  //   this.recipesChanged.next(this.recipes.slice());
  // }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  getRecipeByKey(key: string): Recipe {
    console.log('key: ', key);
    if (this.recipes) {
      const rec = this.recipes.find((r) => r.key === key);
      return rec;
      // } else {
      //   console.log('NONNE recipes:');
      //   const recRef = this.fb.database.ref(`recipes/${key}`);
      //   return recRef.once('value').then((snapshot) => {
      //     console.log('snap: ', snapshot.val());
      //     return snapshot.val();
      //   });
    }
  }

  getRecipeSub(key: string) {
    return this.recipes$.pipe(map((recipes) => recipes.find((r) => r.key === key)));
  }

  addRecipe(recipe: Recipe) {
    if (!this.recipes) {
      this.recipes = [];
    }
    recipe.created = Date.now();
    // this.recipeList.push(recipe);
    // if key needed again later
    // this.recipeList.push(recipe).then((ref) => {
    //   this.linkIngredients(ref.key, recipe.ingredients);
    // });
    // or this?
    return this.recipeList.push(recipe).key;
  }

  updateRecipe(recipe: Recipe, key: string) {
    console.log('recip: ', recipe, ' key: ', key);
    this.recipeList.update(key, { ...recipe });
  }

  // deleteRecipe(index: number) {
  //   this.recipes.splice(index, 1);
  //   this.recipesChanged.next(this.recipes.slice());
  // }

  deleteRecipeByKey(key: string) {
    this.fb.database.ref(`recipes`).child(key).remove();
  }

  fetchRecipes() {
    this.recipeList = this.fb.list('recipes');
    this.recipes$ = this.recipeList.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => {
          // console.log('c: ', c);
          return { key: c.payload.key, ...c.payload.val() };
        })
      ),
      tap((recipes: Recipe[]) => {
        console.log('%c recipes! ', 'background: #222; color: #bada55', recipes);
        // this.setRecipes(rec);
        this.recipes = recipes;
        this.recipeBehaveSubj.next(recipes);
      })
    );
    return this.recipes$;
  }

  // to do: move ingredients to separate key
  // fetchRecipeIngredients(recipe: Recipe) {
  //   const ingsRef = this.fb.database.ref(`recipeIngredients/${recipe.key}`);
  //   return ingsRef.once('value').then((snapshot) => {
  //     recipe.ingredients = snapshot.val();
  //     return snapshot.val();
  //   });
  // }

  // linkIngredients(recipeKey: string, ingredients: any[]) {
  //   this.fb.database.ref('recipeIngredients/' + recipeKey).set(ingredients);
  // }
}
