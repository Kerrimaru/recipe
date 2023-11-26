import { Recipe } from "./recipe.model";
import { EventEmitter, Injectable } from "@angular/core";
// import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable, of, BehaviorSubject } from "rxjs";
// import { DataStorageService } from '../shared/data-storage.service';
import {
  AngularFireDatabase,
  AngularFireList,
  snapshotChanges,
} from "@angular/fire/compat/database";
import { finalize, map, tap } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import * as uuid from "uuid";

@Injectable({ providedIn: "root" })
export class RecipeService {
  constructor(
    private fb: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

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
    // console.log("key: ", key, " recipes: ", this.recipes);
    if (this.recipes.length) {
      const rec = this.recipes.find((r) => r.key === key);
      return rec;
    } else {
      this.fetchRecipes().subscribe((res) => {
        // console.log("res: ", res);
        if (res) {
          this.getRecipeByKey(key);
        }
      });
    }
  }

  getRecipeSub(key: string) {
    return this.recipes$.pipe(
      map((recipes) => recipes.find((r) => r.key === key))
    );
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
    return this.fb.database
      .ref(`recipes`)
      .child(key)
      .remove()
      .then((r) => {
        this.deleteAllNotes(key);
      });
  }

  // i've removed limit for guests
  fetchRecipes(limit?: number) {
    this.recipeList = this.fb.list("recipes", (ref) => {
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

  // hack to update the db
  uploadFile(recipe: Recipe) {
    const filePath = (recipe.userId || "unassigned") + "/" + uuid.v4();
    const fileRef = this.storage.ref(filePath);
    const ref = this.storage.ref(filePath);
    const task = ref.putString(recipe.imagePath, "data_url");
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((newURL) => {
            const _recipe = { ...recipe, imagePath: newURL };
            this.updateRecipe(_recipe, recipe.key);
          });
        })
      )
      .subscribe();
  }

  setNote(
    recipeId: string,
    note: { note: string; userName: string; userId: string }
  ) {
    const recipeNote = { ...note, date: Date.now() };
    const notesRef = this.fb.database
      .ref("recipeNotes")
      .child(recipeId)
      .push(recipeNote);
  }

  fetchRecipeNotes(recipeId: string) {
    return this.fb.database.ref("recipeNotes").child(recipeId).once("value");
  }

  getNotesSub(key: string) {
    return this.recipes$.pipe(
      map((recipes) => recipes.find((r) => r.key === key))
    );
  }

  getNotesList(key: string) {
    return this.fb.list(`recipeNotes/${key}`);
  }

  getUserDates(userId: string, recipeKey?: string) {
    if (recipeKey) {
      return this.fb.list(`userDateMade/${userId}/${recipeKey}`);
    }
  }

  getRecipesMadeSnap(userId: string) {
    return this.fb.database
      .ref("userDateMade")
      .child(userId)
      .once("value")
      .then((snapshot) => {
        let recipeDates = [];
        for (const [key, value] of Object.entries(snapshot.val())) {
          const recipe = this.getRecipeByKey(key);
          const datesArr = [];
          for (const [key, date] of Object.entries(value)) {
            datesArr.push(date);
          }
          if (recipe) {
            const recItem = {
              id: key,
              dates: datesArr,
              name: recipe.name,
              image: recipe.imagePath,
              ingredients: recipe.ingredients,
              value: datesArr.length,
            };
            recipeDates.push(recItem);
          }
        }
        return recipeDates;
      });
  }

  setUserDateMade(userId: string, recipeId: string, date: string) {
    this.fb.database
      .ref("userDateMade")
      .child(userId)
      .child(recipeId)
      .push(date);
  }

  deleteUserDateMade(userId: string, recipeId: string, dateId: string) {
    this.fb.database
      .ref(`userDateMade/${userId}/${recipeId}`)
      .child(dateId)
      .remove();
  }

  // delete all notes asscociated with recipe when recipe deleted
  deleteAllNotes(recipeId: string) {
    this.fb.database.ref(`recipeNotes/${recipeId}`).remove();
  }

  deleteNote(noteId: string, recipeId: string) {
    this.fb.database.ref(`recipeNotes/${recipeId}`).child(noteId).remove();
  }

  updateNote(text: string, noteId: string, recipeId: string) {
    this.fb.database
      .ref(`recipeNotes/${recipeId}`)
      .child(noteId)
      .update({ note: text });
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
