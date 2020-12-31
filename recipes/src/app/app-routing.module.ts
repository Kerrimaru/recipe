import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { ShoppingListComponent } from './shopping-list/shopping-list.component';
// import { RecipesComponent } from './recipes/recipes.component';
// import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';

import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { RecipesResolverService } from './recipes/recipes-resolver.service';
// import { canActivate } from '@angular/fire/auth-guard';
// import { map } from 'rxjs/operators';
// import { RecipesResolverService } from './recipes/recipes-resolver.service';
// import { AuthComponent } from './auth/auth.component';
// import { AuthGuard } from './auth/auth.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToRecipes = () => redirectLoggedInTo(['recipes']);

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' }, <= older syntax
  {
    path: 'recipes',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./recipes/recipes.module').then((module) => module.RecipesModule),
  },
  // {
  //   path: 'recipes',
  //   component: RecipesComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     // { path: 'new', component: RecipeEditComponent },
  //     { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
  //     { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] },
  //   ],
  // },
  // { path: 'new', component: RecipeEditComponent },
  // {
  //   path: 'favourites',
  //   resolve: { recipes: RecipesResolverService },
  //   loadChildren: () => import('./favourites/favourites.module').then((module) => module.FavouritesModule),
  // },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then((module) => module.SettingsModule),
  },
  // {
  //   path: 'shopping-list',
  //   loadChildren: () => import('./shopping-list/shopping-list.module').then((module) => module.ShoppingListModule),
  // },
  // { path: 'shopping-list', component: ShoppingListComponent },
  {
    path: 'login',
    ...canActivate(redirectLoggedInToRecipes),
    loadChildren: () => import('./auth/auth.module').then((module) => module.AuthModule),
  },
  // { path: 'login', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
