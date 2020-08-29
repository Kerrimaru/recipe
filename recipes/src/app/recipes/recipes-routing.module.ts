import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes.component';
import { AuthGuard } from '../auth/auth.guard';
import { EmptyRecipeComponent } from './empty-recipe/empty-recipe.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { canActivate } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { User } from '../auth/user.model';

const redirectLoggedInToRecipes = () =>
  map((user) => {
    console.log('user in routing: ', user);
    if (!user) {
      console.log('login');
      return ['login'];
    } else {
      console.log('empty');
      return true;
    }
    // return !user ? ['login'] : [''];
  });

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    // canActivate: [AuthGuard],
    // canActivate: [AngularFireAuthGuard],
    resolve: { recipes: RecipesResolverService },
    ...canActivate(redirectLoggedInToRecipes),
    children: [
      { path: '', component: EmptyRecipeComponent },
      { path: 'new', component: RecipeEditComponent },
      // { path: ':id', component: RecipeDetailComponent, resolve: { recipes: RecipesResolverService } },
      // { path: ':id/edit', component: RecipeEditComponent, resolve: { recipes: RecipesResolverService } },
      { path: ':id', component: RecipeDetailComponent },
      { path: ':id/edit', component: RecipeEditComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
