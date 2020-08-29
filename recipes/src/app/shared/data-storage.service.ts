import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap, take, exhaustMap, takeWhile } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}
  // this.userSub = this.authService.user.subscribe((user) => {
  //   this.user = user;
  //   console.log('user in header: ', user);
  //   this.isAuth = !!user;
  // });
  userName: string;

  // storeRecipes() {
  //   const recipes = this.recipeService.getRecipes();
  //   this.http
  //     .put('https://kerr-recipe.firebaseio.com/recipes.json', recipes)
  //     .subscribe((res) => console.log('res: ', res));
  // }

  createRecipe(recipe: Recipe) {
    debugger;
    recipe.addedBy = this.authService.user.value.name;
    // const recipes = this.recipeService.getRecipes();
    this.http
      .post('https://kerr-recipe.firebaseio.com/recipes.json', recipe)
      .subscribe((res) => console.log('res: ', res));
  }

  editRecipe(recipeId: string, recipe: Recipe) {
    debugger;
    console.log('id; ', recipeId, ' recipe : ', recipe);
    this.http
      .put(`https://kerr-recipe.firebaseio.com/recipes/${recipeId}.json`, recipe)
      .subscribe((res) => console.log('res: ', res));
  }

  fetchRecipes() {
    debugger;
    return this.http.get('https://kerr-recipe.firebaseio.com/recipes.json').pipe(
      takeWhile((recipes) => !!recipes),
      map((recipes) => {
        const recipeArray = Object.entries(recipes).map((e) => {
          return Object.assign(e[1], { id: e[0] });
        });
        return recipeArray.map((recipe) => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );

    // .pipe(

    // );
    // .subscribe((res) => {
    // });
  }
}
