import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { map, take, first } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private datStorageService: DataStorageService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const readOnly = this.authService.readOnly.getValue();
    const id = route.params.id;

    // if (!recipes.length) {
    return this.recipeService.fetchRecipes(readOnly ? 30 : null).pipe(
      first(),
      map((res) => res)
    );
  }
}

// @Injectable({ providedIn: 'root' })
// export class RecipesResolverService implements Resolve<Recipe[]> {
//   constructor(private datStorageService: DataStorageService, private recipeService: RecipeService) {}

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     const recipes = this.recipeService.getRecipes();

//     if (recipes.length === 0) {
//       return this.datStorageService.fetchRecipes();
//     } else {
//       return recipes;
//     }
//   }
// }
