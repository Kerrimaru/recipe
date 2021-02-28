import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
// import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
// import { DataStorageService } from '../shared/data-storage.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map, tap, switchMap, filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private fb: AngularFireDatabase) {}

  private recipes: any[] = [];
  recipeList: AngularFireList<Recipe>;
  recipes$: Observable<Recipe[]>;
  recipeBehaveSubj = new BehaviorSubject<Recipe[]>([]);

  recipeNotes: AngularFireList<any[]>;
  recipeNotes$: Observable<any>;
  recipesChanged = new Subject<Recipe[]>();

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

  getRecipeByKey(key: string): Recipe {
    if (this.recipes) {
      const rec = this.recipes.find((r) => r.key === key);
      return rec;
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
    this.recipeList.update(key, { ...recipe });
  }

  deleteRecipeByKey(key: string) {
    this.fb.database.ref(`recipes`).child(key).remove();
  }

  fetchRecipes(limit?: number) {
    this.recipeList = this.fb.list('recipes', (ref) => {
      if (limit) {
        return ref.limitToFirst(limit);
      }
      return ref;
    });
    this.recipes$ = this.recipeList.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => {
          return { key: c.payload.key, ...c.payload.val() };
        });
      }),
      tap((recipes: Recipe[]) => {
        this.recipes = recipes;
        this.recipeBehaveSubj.next(recipes);
      })
    );
    return this.recipes$;
  }

  setNote(recipeId: string, note: any, userName: string, userId: string) {
    const recipeNote = { note: note, user: userName, userId: userId, date: Date.now() };
    const notesRef = this.fb.database.ref('recipeNotes').child(recipeId).push(recipeNote);
  }

  fetchRecipeNotes(recipeId: string) {
    return this.fb.database.ref('recipeNotes').child(recipeId).once('value');
  }

  getNotesSub(key: string) {
    return this.recipes$.pipe(map((recipes) => recipes.find((r) => r.key === key)));
  }

  getNotesList(key: string) {
    return this.fb.list(`recipeNotes/${key}`);
  }

  getUserDates(userId: string, recipeKey: string) {
    return this.fb.list(`userDateMade/${userId}/${recipeKey}`);
  }

  setUserDateMade(userId: string, recipeId: string, date: string) {
    this.fb.database.ref('userDateMade').child(userId).child(recipeId).push(date);
  }

  deleteNote(noteId: string, recipeId: string) {
    this.fb.database.ref(`recipeNotes/${recipeId}`).child(noteId).remove();
  }

  updateNote(text: string, noteId: string, recipeId: string) {
    this.fb.database.ref(`recipeNotes/${recipeId}`).child(noteId).update({ note: text });
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
